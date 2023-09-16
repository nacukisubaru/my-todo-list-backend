import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Session, cloudApi, serviceClients } from '@yandex-cloud/nodejs-sdk';
import { LangCodesISO } from 'src/helpers/languageHelper';

const { ai: { translate_translation_service: { TranslateRequest, TranslateRequest_Format: Format, ListLanguagesRequest, DetectLanguageRequest } } } = cloudApi;

@Injectable()
export class YandexCloudService {

    private AUTH_TOKEN = process.env.yandexAuthToken;
    private FOLDER_ID = process.env.yandexFolderId;
    private client = null;


    async translate(word: string, targetLanguageCode: string, sourceLanguageCode: string = '') {
        const TEXTS = [word];

        const client = await this.createSession();
        
        const langList = await this.getLanguagesList();
        const langCodes = langList.map((lang) => {return lang.code});
        
        if(!langCodes.includes(targetLanguageCode)) {
            throw new HttpException('Выбраный язык не поддерживается', HttpStatus.BAD_REQUEST);
        }

        const prepareToTranslate: any = {
            targetLanguageCode,
            format: Format.PLAIN_TEXT,
            folderId: this.FOLDER_ID,
            texts: TEXTS,
        };

        if (sourceLanguageCode) {
            prepareToTranslate.sourceLanguageCode = sourceLanguageCode;
        }

        const response = await client.translate(TranslateRequest.fromPartial(prepareToTranslate));

        for (const [idx, translateRes] of response.translations.entries()) {
            let originalLang = '';
            if (sourceLanguageCode) {
                originalLang = sourceLanguageCode;
            } else {
                originalLang = translateRes.detectedLanguageCode
            }

            return { originalWord: word, translatedWord: translateRes.text, originalLang, translateLang: targetLanguageCode };
        }

        throw new HttpException('Перевод не найден', HttpStatus.NOT_FOUND);
    }

    async getLanguage(text: string, hints: string[] = []): Promise<string> {
        const client = await this.createSession();
        const response = await client.detectLanguage(DetectLanguageRequest.fromPartial({
            folderId: this.FOLDER_ID,
            text,
            languageCodeHints: hints
        }));

        if (!response.languageCode) {
            throw new HttpException('Язык не найден', HttpStatus.NOT_FOUND);
        }

        return response.languageCode;
    }

    async getLanguagesList() {

        let client = await this.createSession();
        if (this.client) {
            client = this.client;
        }
        
        const response = await client.listLanguages(ListLanguagesRequest.fromPartial({
            folderId: this.FOLDER_ID,
        }));

        if(!response) {
            throw new HttpException('Ошибка повторите позднее', HttpStatus.BAD_REQUEST);
        }

        const languages = [];
        response.languages.map((language) => {
            if (language.name !== "") {
                const lang = {...language, isoName: LangCodesISO[language.code]}
                languages.push(lang);
            }
        })
        
        return languages;
    }

    async createSession() {
        const session = new Session({ oauthToken: this.AUTH_TOKEN });
        const client = session.client(serviceClients.TranslationServiceClient);
        this.client = client;
        return client;
    }

}
