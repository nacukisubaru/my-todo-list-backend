import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Session, cloudApi, serviceClients } from '@yandex-cloud/nodejs-sdk';
import { DictionarySettingsService } from 'src/dictionary-settings/dictionary-settings.service';
import { LangCodesISO } from 'src/helpers/languageHelper';

const { ai: { translate_translation_service: { TranslateRequest, TranslateRequest_Format: Format, ListLanguagesRequest } } } = cloudApi;

@Injectable()
export class YandexCloudService {

    private AUTH_TOKEN = process.env.yandexAuthToken;
    private FOLDER_ID = process.env.yandexFolderId;
    private client = null;

    constructor(private dictionarySettingsService: DictionarySettingsService) {
    }

    async translate(word: string, targetLanguageCode: string, userId: number) {
        const TEXTS = [word];

        const client = await this.createSession();
        
        const langList = await this.getLanguagesList();
        const langCodes = langList.map((lang) => {return lang.code});
        
        if(!langCodes.includes(targetLanguageCode)) {
            throw new HttpException('Выбраный язык не поддерживается', HttpStatus.BAD_REQUEST);
        }
        await this.dictionarySettingsService.setDefaultLanguage(userId, targetLanguageCode);
        
        const response = await client.translate(TranslateRequest.fromPartial({
            targetLanguageCode,
            format: Format.PLAIN_TEXT,
            folderId: this.FOLDER_ID,
            texts: TEXTS,
        }));

        for (const [idx, translateRes] of response.translations.entries()) {
            return { originalWord: word, translatedWord: translateRes.text, textLang: translateRes.detectedLanguageCode };
        }

        return false;
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
