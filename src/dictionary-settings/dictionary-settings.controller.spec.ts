import { Test, TestingModule } from '@nestjs/testing';
import { DictionarySettingsController } from './dictionary-settings.controller';
import { DictionarySettingsService } from './dictionary-settings.service';

describe('DictionarySettingsController', () => {
  let controller: DictionarySettingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DictionarySettingsController],
      providers: [DictionarySettingsService],
    }).compile();

    controller = module.get<DictionarySettingsController>(DictionarySettingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
