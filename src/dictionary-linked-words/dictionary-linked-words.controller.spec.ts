import { Test, TestingModule } from '@nestjs/testing';
import { DictionaryLinkedWordsController } from './dictionary-linked-words.controller';
import { DictionaryLinkedWordsService } from './dictionary-linked-words.service';

describe('DictionaryLinkedWordsController', () => {
  let controller: DictionaryLinkedWordsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DictionaryLinkedWordsController],
      providers: [DictionaryLinkedWordsService],
    }).compile();

    controller = module.get<DictionaryLinkedWordsController>(DictionaryLinkedWordsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
