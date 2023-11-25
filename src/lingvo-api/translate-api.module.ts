import { Module } from '@nestjs/common';
import { LingvoApiService } from './lingvo-api.service';
import { TranslateApiController } from './translate-api.controller';
import { HttpModule } from '@nestjs/axios';
import { YandexCloudModule } from 'src/yandex-cloud/yandex-cloud.module';
import { DictionarySettingsModule } from 'src/dictionary-settings/dictionary-settings.module';
import { JwtModule } from '@nestjs/jwt';
import { DictionaryModule } from 'src/dictionary/dictionary.module';
import { WordHuntApiService } from './word-hunt-translate-api';
import { TranslateApiService } from './translate-api';
import { SequelizeModule } from '@nestjs/sequelize';
import { TranslateApiSettings } from './entities/translate-api.entity';

@Module({
  controllers: [TranslateApiController],
  providers: [LingvoApiService, WordHuntApiService, TranslateApiService],
  imports: [
    HttpModule, 
    YandexCloudModule, 
    DictionarySettingsModule, 
    JwtModule,
    DictionaryModule,
    SequelizeModule.forFeature([TranslateApiSettings])
  ],
})
export class TranslateApiModule {}
