import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLingvoApiDto } from './dto/create-lingvo-api.dto';
import { UpdateLingvoApiDto } from './dto/update-lingvo-api.dto';
import { HttpService } from '@nestjs/axios';
import { response } from 'express';
import { YandexCloudService } from 'src/yandex-cloud/yandex-cloud.service';
import { DictionarySettingsService } from 'src/dictionary-settings/dictionary-settings.service';

@Injectable()
export class LingvoApiService {
  
  private lingvoApiKey = process.env.lingvoKey;
  private url = "https://developers.lingvolive.com";
  private languageCodes = {
    ru: 1049, 
    en: 1033, 
    uk: 1058, 
    ch: 1028, 
    da: 1030, 
    de: 1031, 
    el: 1032, 
    es: 1034, 
    fr: 1036, 
    it: 1040, 
    kk: 1087, 
    la: 1142, pl: 1045, tt: 1092
  };

  constructor(private readonly httpService: HttpService,
    private yandexService: YandexCloudService,
    private dictionarySettingsService: DictionarySettingsService
  ) {}


  async authorize() {
      const response: any = await this.httpService.axiosRef.post(
        this.url + '/api/v1/authenticate',
        {},
        {
          headers: {
            "Authorization": 'Basic ' + this.lingvoApiKey,
            "Content-Type": "application/json",
            "Content-Length": 0
          }
        }
      ).catch(function (error) {
        throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
      });

      return response.data;
  }

  async shortTranslateWord(word: string, sourceLang: string, targetLang: string) {
    const token = await this.authorize();
    const response = await this.httpService.axiosRef.get(
      this.url + `/api/v1/Minicard?text=${word}&srcLang=${this.languageCodes[sourceLang]}&dstLang=${this.languageCodes[targetLang]}`, 
      {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }
      ).catch(function (error) {
        throw new HttpException(error.response.data, HttpStatus.BAD_REQUEST);
      });

      return {
        originalWord: response.data.Heading,
        translatedWord: response.data.Translation.Translation,
        originalLang: sourceLang, 
        translateLang: targetLang
      };
  }

  async translate(word: string, userId: number) {
    const dictionarySettings = await this.dictionarySettingsService.getActiveSettings(userId);
    const lang = await this.yandexService.getLanguage(word);
    
    let sourceLang = '';
    let targetLang = '';
    
    if (lang === dictionarySettings.sourceLanguage) {
      sourceLang = lang;
      targetLang = dictionarySettings.targetLanguage;
    } else {
      sourceLang = dictionarySettings.targetLanguage;
      targetLang = lang;
    }

    try {
      const result: any = await this.shortTranslateWord(word, sourceLang, targetLang);
      if (result.originalWord.length !== word.length) {
        throw new HttpException('Слово не найдено', HttpStatus.NOT_FOUND);
      }

      if (lang === dictionarySettings.sourceLanguage && await this.yandexService.getLanguage(result.translatedWord) === sourceLang) {
        throw new HttpException('Слово не найдено', HttpStatus.NOT_FOUND);
      }

      return result;
    } catch (e) {
      try {
        return await this.yandexService.translate(word, targetLang, sourceLang);
      } catch (error) {
        throw new HttpException(error, HttpStatus.NOT_FOUND);
      }
    }
  }

  create(createLingvoApiDto: CreateLingvoApiDto) {
    return 'This action adds a new lingvoApi';
  }

  findAll() {
    return `This action returns all lingvoApi`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lingvoApi`;
  }

  update(id: number, updateLingvoApiDto: UpdateLingvoApiDto) {
    return `This action updates a #${id} lingvoApi`;
  }

  remove(id: number) {
    return `This action removes a #${id} lingvoApi`;
  }
}
