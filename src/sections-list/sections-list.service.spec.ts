import { Test, TestingModule } from '@nestjs/testing';
import { SectionsListService } from './sections-list.service';

describe('SectionsListService', () => {
  let service: SectionsListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SectionsListService],
    }).compile();

    service = module.get<SectionsListService>(SectionsListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
