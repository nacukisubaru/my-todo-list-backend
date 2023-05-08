import { Test, TestingModule } from '@nestjs/testing';
import { SectionsTodoListService } from './sections-todo-list.service';

describe('SectionsTodoListService', () => {
  let service: SectionsTodoListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SectionsTodoListService],
    }).compile();

    service = module.get<SectionsTodoListService>(SectionsTodoListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
