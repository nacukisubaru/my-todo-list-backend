import { Test, TestingModule } from '@nestjs/testing';
import { DictionaryExamplesService } from './dictionary-examples.service';

describe('DictionaryExamplesService', () => {
  let service: DictionaryExamplesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DictionaryExamplesService],
    }).compile();

    service = module.get<DictionaryExamplesService>(DictionaryExamplesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
