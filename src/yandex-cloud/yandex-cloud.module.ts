import { Module } from '@nestjs/common';
import { YandexCloudService } from './yandex-cloud.service';
import { YandexCloudController } from './yandex-cloud.controller';

@Module({
  controllers: [YandexCloudController],
  providers: [YandexCloudService]
})
export class YandexCloudModule {}
