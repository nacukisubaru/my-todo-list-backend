import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards } from '@nestjs/common';
import { LingvoApiService } from './lingvo-api.service';
import { CreateLingvoApiDto } from './dto/create-lingvo-api.dto';
import { UpdateLingvoApiDto } from './dto/update-lingvo-api.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { translateMethod } from './types/lingvo-types';
import { YandexCloudService } from 'src/yandex-cloud/yandex-cloud.service';

@Controller('lingvo-api')
export class LingvoApiController {
  constructor(
    private readonly lingvoApiService: LingvoApiService,
    private readonly yandexService: YandexCloudService
  ) { }

  @Get('/short-translate')
  shortTranslateWord(
    @Query('word') word: string, 
    @Query('sourceLang') sourceLang: string, 
    @Query('targetLang') targetLang: string,
    @Query('getYandexTranslate') getYandexTranslate: string = 'false',
  ) {
    let isYandexTranslate = false;
    if (getYandexTranslate === 'true') {
      isYandexTranslate = true;
    }
    return this.lingvoApiService.shortTranslateWord(word, sourceLang, targetLang, isYandexTranslate);
  }

  @Get('/translate')
  translate(
    @Query('word') word: string,
    @Query('sourceLang') sourceLang: string,
    @Query('targetLang') targetLang: string,
    @Query('translateMethod') translateMethod: translateMethod = "lingvo",
    @Query('getYandexTranslate') getYandexTranslate: string = 'false',
  ) {
    if (translateMethod === "lingvo") {
      let isYandexTranslate = false;
      if (getYandexTranslate === 'true') {
        isYandexTranslate = true;
      }
      return this.lingvoApiService.translate(word, sourceLang, targetLang, isYandexTranslate);
    } else {
      return this.yandexService.translate(word, targetLang, sourceLang);
    }
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

    return this.lingvoApiService.fullTranslateWord(word, sourceLang, targetLang, isTranscription, isYandexTranslate, true);
  }


  @Get('/get-examples-for-word')
  getExamplesForWord(
    @Query('word') word: string,
    @Query('sourceLang') sourceLang: string,
    @Query('targetLang') targetLang: string,
    @Query('pageSize') pageSize: string,
  ) {
    return this.lingvoApiService.getExamplesForWord(word, sourceLang, targetLang, +pageSize);
  }
}
