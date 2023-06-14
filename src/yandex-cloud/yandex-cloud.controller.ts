import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { YandexCloudService } from './yandex-cloud.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('yandex-cloud')
export class YandexCloudController {
  constructor(private readonly yandexCloudService: YandexCloudService) {
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('/translate')
  translate(@Query('word') word: string, @Query('targetLang') targetLang: string, @Req() request) {
    return this.yandexCloudService.translate(word, targetLang, request.user.id);
  }


  @Get('/get-languages-list')
  getLanguagesList() {
    return this.yandexCloudService.getLanguagesList();
  }

}
