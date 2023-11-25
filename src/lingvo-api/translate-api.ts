import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DictionaryService } from "src/dictionary/dictionary.service";
import { YandexCloudService } from "src/yandex-cloud/yandex-cloud.service";
import { LingvoApiService } from "./lingvo-api.service";
import { WordHuntApiService } from "./word-hunt-translate-api";
import { InjectModel } from "@nestjs/sequelize";
import { TranslateApiSettings } from "./entities/translate-api.entity";

@Injectable()
export class TranslateApiService {

    constructor(
        @InjectModel(TranslateApiSettings) private translateApiSettingsRepo: typeof TranslateApiSettings,
        private yandexService: YandexCloudService,
        private dictionaryService: DictionaryService,
        private lingvoService: LingvoApiService,
        private wordHuntService: WordHuntApiService
    ) { }

    private async getSettings() {
        const settings = await this.translateApiSettingsRepo.findAll();
        if (settings.length) {
            return settings[0];
        } else {
            this.translateApiSettingsRepo.create({
                lingvo: false,
                wordHunt: true
            });
        }
    }

    private async getSavedTranslates(word: string, sourceLang: string, translates: ITranslateWord[]) {
        let savedValues: string[] = [];
        let dictionaryWordId = '';
        let translatesResult = [];

        const dictionaryWord = await this.dictionaryService.getOneByTranslation(word, sourceLang);
        if (dictionaryWord) {
            const linkedWords = dictionaryWord.dataValues.dictionaryLinkedWords;
            if (linkedWords.length) {
                savedValues = linkedWords.map(item => item.word);
            }
            dictionaryWordId = dictionaryWord.id;
        }
      
        translates.map(item => {
            if (savedValues.includes(item.word)) {
                translatesResult.push({ ...item, isActive: true, dictionaryWordId, originalWord: word });
            } else {
                translatesResult.push({ ...item, isActive: false, dictionaryWordId, originalWord: word });
            }
        });

        return translatesResult;
    }

    async translate({word, sourceLang, targetLang, getYandexTranslate = false, translateMethod = "translateApi"}: ITranslateParams) {
        if (!sourceLang) {
            throw new HttpException('sourceLang missed', HttpStatus.BAD_REQUEST);
        }

        if (!targetLang) {
            throw new HttpException('targetLang missed', HttpStatus.BAD_REQUEST);
        }

        if (translateMethod === "translateApi") {
            let wordsList = await this.getTranslateValues({
                word, 
                sourceLang, 
                targetLang, 
                getTranscription: true, 
                getYandexTranslate, 
                getSavedWords: false
            });

            const transcription = wordsList.find(word => word.type === 'transcription');
            wordsList = wordsList.filter(word => word.type !== 'transcription');

            return {
                originalWord: word,
                translatedWord: wordsList[0].word,
                originalLang: sourceLang,
                translateLang: targetLang,
                transcription: transcription ? transcription.word : "",
                wordsList: wordsList
            };
        }

        return this.yandexService.translate(word, targetLang, sourceLang);
    }

    async getTranslateValues({
        word, 
        sourceLang, 
        targetLang,
        getYandexTranslate = false, 
        getSavedWords = false,
        getTranscription = false
    }: ITranslateValuesParams) {

        let translates = [];
        translates.push({word: '', type: 'яндекс'});
        const settings = await this.getSettings();

        try {
          if (getYandexTranslate) {
            const yandexTranslate = await this.yandexService.translate(word, targetLang, sourceLang);
            if (yandexTranslate.translatedWord) {
              translates.push({word: yandexTranslate.translatedWord, type: 'яндекс'});
            }
          }
        } catch (error) {}
        
        if (settings.lingvo) {
            const lingvoTranslates = await this.lingvoService.fullTranslateWord(word, sourceLang, targetLang, getTranscription);
            if (lingvoTranslates.length) {
                translates = translates.concat(lingvoTranslates);
            }
        }

        if (settings.wordHunt && (targetLang === "en" || targetLang === "ru")) {
            const wordHuntTranslates = await this.wordHuntService.parseWords(word, targetLang);
            if (wordHuntTranslates.length) {
                translates = translates.concat(wordHuntTranslates);
            }
        }

        if (getSavedWords) {
            return (await this.getSavedTranslates(word, sourceLang, translates)).reverse();
        }

        return translates.reverse();
    }


    async getExamples({word, sourceLang, targetLang, pageSize}: IExamplesParams) {
        const examples = [];
        const lingvoExamples = await this.lingvoService.getExamplesForWord(word, sourceLang, targetLang, +pageSize);
        examples.concat(lingvoExamples);
        return examples;
    }
}