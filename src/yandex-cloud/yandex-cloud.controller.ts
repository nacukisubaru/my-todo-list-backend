import { Controller, Get, Query } from '@nestjs/common';
import { YandexCloudService } from './yandex-cloud.service';

@Controller('yandex-cloud')
export class YandexCloudController {
  constructor(private readonly yandexCloudService: YandexCloudService) {
  }

  @Get('/translate')
  translate(@Query('word') word: string, @Query('targetLang') targetLang: string) {
    return this.yandexCloudService.translate(word, targetLang);
  }


  @Get('/get-languages-list')
  getLanguagesList() {
    return this.yandexCloudService.getLanguagesList();
  }

}
