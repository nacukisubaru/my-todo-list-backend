import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DictionaryService } from "src/dictionary/dictionary.service";
import { YandexCloudService } from "src/yandex-cloud/yandex-cloud.service";
import { LingvoApiService } from "./lingvo-api.service";
import { WordHuntApiService } from "./word-hunt-translate-api";
import { InjectModel } from "@nestjs/sequelize";
import { TranslateApiSettings } from "./entities/translate-api.entity";
import { UpdateLingvoApiDto } from "./dto/update-translate-api-settings.dto";

@Injectable()
export class TranslateApiService {

    constructor(
        @InjectModel(TranslateApiSettings) private translateApiSettingsRepo: typeof TranslateApiSettings,
        private yandexService: YandexCloudService,
        private dictionaryService: DictionaryService,
        private lingvoService: LingvoApiService,
        private wordHuntService: WordHuntApiService
    ) { }

    async getSettings(userId: number) {
        const settings = await this.translateApiSettingsRepo.findOne({where: {userId}});
        if (settings) {
            return settings;
        } else {
            const settingsObj = {
                lingvo: true,
                wordHunt: true,
                userId
            };
            this.translateApiSettingsRepo.create(settingsObj);
        }
    }

    async updateSettings(updateDto: UpdateLingvoApiDto, userId: number) {
       return await this.translateApiSettingsRepo.update(updateDto, {where: {userId}});
    }

    async translate({word, sourceLang, targetLang, getYandexTranslate = false, translateMethod = "translateApi", userId}: ITranslateParams) {
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
                getSavedWords: false,
                userId
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
        getTranscription = false,
        userId
    }: ITranslateValuesParams) {

        let translates = [];
       
        const settings = await this.getSettings(userId);
        
        if (settings.lingvo) {
            let lingvoTranslates = [];
            try {
                lingvoTranslates = await this.lingvoService.fullTranslateWord(word, sourceLang, targetLang, getTranscription);
            } catch (error) {}

            if (lingvoTranslates.length) {
                translates = translates.concat(lingvoTranslates);
            }
        }

        if (settings.wordHunt && (targetLang === "en" || targetLang === "ru")) {
            let wordHuntTranslates = [];
            try {
                wordHuntTranslates = await this.wordHuntService.parseWords(word, targetLang);
            } catch (error) {}
            if (wordHuntTranslates.length) {
                translates = translates.concat(wordHuntTranslates);
            }
        }
        
        translates.push({word: '', type: 'яндекс'});
        try {
          if (getYandexTranslate) {
            const yandexTranslate = await this.yandexService.translate(word, targetLang, sourceLang);
            if (yandexTranslate.translatedWord) {
              translates.push({word: yandexTranslate.translatedWord, type: 'яндекс'});
            }
          }
        } catch (error) {}

        const otherWords = translates.filter(translate => translate.type == 'яндекс' || translate.type == 'все');
        translates = translates.filter(translate => translate.type !== 'яндекс' && translate.type !== 'все'); 
        
        otherWords.map(word => {
            translates.push(word);
        })      
        
        if (getSavedWords) {
            const result = await this.getSavedTranslates(word, sourceLang, translates);
            return result;
        }

        return translates;
    }

    async getExamples({word, sourceLang, targetLang, pageSize, userId}: IExamplesParams) {
        let examples = [];

        const settings = await this.getSettings(userId);
        if (settings.lingvo) {
            const lingvoExamples = await this.lingvoService.getExamplesForWord(word, sourceLang, targetLang, +pageSize);
            examples = examples.concat(lingvoExamples);
        }

        if (settings.wordHunt) {
            const wordHuntExamples = await this.wordHuntService.parseExamples(word);
            examples = examples.concat(wordHuntExamples);
        }

        return examples.reverse();
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
        
        const translatesWords = [];
        translates.map(item => {
            translatesWords.push(item.word);
            if (savedValues.includes(item.word)) {
                translatesResult.push({ ...item, isActive: true, dictionaryWordId, originalWord: word });
            } else {
                translatesResult.push({ ...item, isActive: false, dictionaryWordId, originalWord: word });
            }
        });

        savedValues.map(savedValue => {
            if (!translatesWords.includes(savedValue)) {
                translatesResult.push({word: savedValue, isActive: true, type: 'все', dictionaryWordId, originalWord: word})
            }
        })

        return translatesResult;
    }
}