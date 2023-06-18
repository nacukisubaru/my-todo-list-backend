import { Test, TestingModule } from '@nestjs/testing';
import { DictionarySettingsService } from './dictionary-settings.service';

describe('DictionarySettingsService', () => {
  let service: DictionarySettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DictionarySettingsService],
    }).compile();

    service = module.get<DictionarySettingsService>(DictionarySettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
