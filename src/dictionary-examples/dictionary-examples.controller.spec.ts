import { Test, TestingModule } from '@nestjs/testing';
import { DictionaryExamplesController } from './dictionary-examples.controller';
import { DictionaryExamplesService } from './dictionary-examples.service';

describe('DictionaryExamplesController', () => {
  let controller: DictionaryExamplesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DictionaryExamplesController],
      providers: [DictionaryExamplesService],
    }).compile();

    controller = module.get<DictionaryExamplesController>(DictionaryExamplesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
