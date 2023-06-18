import { Test, TestingModule } from '@nestjs/testing';
import { YandexCloudService } from './yandex-cloud.service';

describe('YandexCloudService', () => {
  let service: YandexCloudService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [YandexCloudService],
    }).compile();

    service = module.get<YandexCloudService>(YandexCloudService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
