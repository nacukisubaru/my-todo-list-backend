import { Module } from '@nestjs/common';
import { LingvoApiService } from './lingvo-api.service';
import { TranslateApiController } from './translate-api.controller';
import { HttpModule } from '@nestjs/axios';
import { YandexCloudModule } from 'src/yandex-cloud/yandex-cloud.module';
import { DictionarySettingsModule } from 'src/dictionary-settings/dictionary-settings.module';
import { JwtModule } from '@nestjs/jwt';
import { DictionaryModule } from 'src/dictionary/dictionary.module';
import { ReversoTranslateApiService } from './reverso-translate-api';
import { TranslateApiService } from './translate-api';

@Module({
  controllers: [TranslateApiController],
  providers: [LingvoApiService, ReversoTranslateApiService, TranslateApiService],
  imports: [HttpModule, YandexCloudModule, DictionarySettingsModule, JwtModule, DictionaryModule],
})
export class TranslateApiModule {}
