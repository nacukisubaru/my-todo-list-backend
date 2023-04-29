import { Test, TestingModule } from '@nestjs/testing';
import { SectionsTodoListController } from './sections-todo-list.controller';
import { SectionsTodoListService } from './sections-todo-list.service';

describe('SectionsTodoListController', () => {
  let controller: SectionsTodoListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SectionsTodoListController],
      providers: [SectionsTodoListService],
    }).compile();

    controller = module.get<SectionsTodoListController>(SectionsTodoListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
