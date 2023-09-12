import { Module } from '@nestjs/common';
import { YandexCloudService } from './yandex-cloud.service';
import { YandexCloudController } from './yandex-cloud.controller';
import { DictionarySettingsModule } from 'src/dictionary-settings/dictionary-settings.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [YandexCloudController],
  providers: [YandexCloudService],
  imports: [
    JwtModule
  ],
  exports: [
    YandexCloudService
  ]
})
export class YandexCloudModule {}
