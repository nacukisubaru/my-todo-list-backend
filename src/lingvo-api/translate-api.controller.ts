import { Controller, Get, Query, } from '@nestjs/common';
import { TranslateApiService } from './translate-api';

@Controller('translate-api')
export class TranslateApiController {
  constructor(
    private readonly translateService: TranslateApiService
  ) { }

  @Get('/translate')
  translate(
    @Query('word') word: string,
    @Query('sourceLang') sourceLang: string,
    @Query('targetLang') targetLang: string,
    @Query('translateMethod') translateMethod: translateMethod = "translateApi",
    @Query('getYandexTranslate') getYandex: string = 'false',
  ) {
    let getYandexTranslate = getYandex ? JSON.parse(getYandex) : false;
    return this.translateService.translate({word, sourceLang, targetLang, getYandexTranslate, translateMethod});
  }

  @Get('/full-translate')
  fullTranslate(
    @Query('word') word: string,
    @Query('sourceLang') sourceLang: string,
    @Query('targetLang') targetLang: string,
    @Query('getTranscription') getTranscription: string = 'false',
    @Query('getYandexTranslate') getYandexTranslate: string = 'false',
  ) {

    let isTranscription = false;
    if (getTranscription === 'true') {
      isTranscription = true;
    }
    
    let isYandexTranslate = false;
    if (getYandexTranslate === 'true') {
      isYandexTranslate = true;
    }

    return this.translateService.getTranslateValues({
      word, 
      sourceLang,
      targetLang, 
      getTranscription: isTranscription,
      getYandexTranslate: isYandexTranslate, 
      getSavedWords: true
    });
  }

  @Get('/get-examples-for-word')
  getExamplesForWord(
    @Query('word') word: string,
    @Query('sourceLang') sourceLang: string,
    @Query('targetLang') targetLang: string,
    @Query('pageSize') pageSize: string,
  ) {
    return this.translateService.getExamples({word, sourceLang, targetLang, pageSize: +pageSize});
  }
}
