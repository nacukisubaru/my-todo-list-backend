import { Test, TestingModule } from '@nestjs/testing';
import { DictionaryLinkedWordsService } from './dictionary-linked-words.service';

describe('DictionaryLinkedWordsService', () => {
  let service: DictionaryLinkedWordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DictionaryLinkedWordsService],
    }).compile();

    service = module.get<DictionaryLinkedWordsService>(DictionaryLinkedWordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
