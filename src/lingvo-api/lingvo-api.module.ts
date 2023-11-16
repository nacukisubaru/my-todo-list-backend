import { Module } from '@nestjs/common';
import { LingvoApiService } from './lingvo-api.service';
import { LingvoApiController } from './lingvo-api.controller';
import { HttpModule } from '@nestjs/axios';
import { YandexCloudModule } from 'src/yandex-cloud/yandex-cloud.module';
import { DictionarySettingsModule } from 'src/dictionary-settings/dictionary-settings.module';
import { JwtModule } from '@nestjs/jwt';
import { DictionaryModule } from 'src/dictionary/dictionary.module';

@Module({
  controllers: [LingvoApiController],
  providers: [LingvoApiService],
  imports: [HttpModule, YandexCloudModule, DictionarySettingsModule, JwtModule, DictionaryModule],
})
export class LingvoApiModule {}
