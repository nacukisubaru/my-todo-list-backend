import { Module } from '@nestjs/common';
import { LingvoApiService } from './lingvo-api.service';
import { LingvoApiController } from './lingvo-api.controller';
import { HttpModule } from '@nestjs/axios';
import { YandexCloudModule } from 'src/yandex-cloud/yandex-cloud.module';
import { DictionarySettingsModule } from 'src/dictionary-settings/dictionary-settings.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [LingvoApiController],
  providers: [LingvoApiService],
  imports: [HttpModule, YandexCloudModule, DictionarySettingsModule, JwtModule],
})
export class LingvoApiModule {}
