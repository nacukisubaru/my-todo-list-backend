import { Test, TestingModule } from '@nestjs/testing';
import { YandexCloudController } from './yandex-cloud.controller';
import { YandexCloudService } from './yandex-cloud.service';

describe('YandexCloudController', () => {
  let controller: YandexCloudController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [YandexCloudController],
      providers: [YandexCloudService],
    }).compile();

    controller = module.get<YandexCloudController>(YandexCloudController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
