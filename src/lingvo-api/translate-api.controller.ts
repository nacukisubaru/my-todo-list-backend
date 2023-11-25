import { Body, Controller, Get, Post, Query, Req, UseGuards, } from '@nestjs/common';
import { TranslateApiService } from './translate-api';
import { UpdateLingvoApiDto } from './dto/update-translate-api-settings.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('translate-api')
export class TranslateApiController {
  constructor(
    private readonly translateService: TranslateApiService
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get('/translate')
  translate(
    @Query('word') word: string,
    @Query('sourceLang') sourceLang: string,
    @Query('targetLang') targetLang: string,
    @Query('translateMethod') translateMethod: translateMethod = "translateApi",
    @Query('getYandexTranslate') getYandex: string = 'false',
    @Req() request
  ) {
    let getYandexTranslate = getYandex ? JSON.parse(getYandex) : false;
    return this.translateService.translate({word, sourceLang, targetLang, getYandexTranslate, translateMethod, userId: request.user.id});
  }

  @UseGuards(JwtAuthGuard)
  @Get('/full-translate')
  fullTranslate(
    @Query('word') word: string,
    @Query('sourceLang') sourceLang: string,
    @Query('targetLang') targetLang: string,
    @Query('getTranscription') getTranscription: string = 'false',
    @Query('getYandexTranslate') getYandexTranslate: string = 'false',
    @Req() request
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
      getSavedWords: true,
      userId: request.user.id
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/get-examples-for-word')
  getExamplesForWord(
    @Query('word') word: string,
    @Query('sourceLang') sourceLang: string,
    @Query('targetLang') targetLang: string,
    @Query('pageSize') pageSize: string,
    @Req() request
  ) {
    return this.translateService.getExamples({word, sourceLang, targetLang, pageSize: +pageSize, userId: request.user.id});
  }

  @UseGuards(JwtAuthGuard)
  @Get('/get-settings')
  getSettings(@Req() request) {
    return this.translateService.getSettings(request.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/update-settings')
  updateSettings(@Body() updateDto: UpdateLingvoApiDto, @Req() request) {
    return this.translateService.updateSettings(updateDto, request.user.id);
  }
}