import { Test, TestingModule } from '@nestjs/testing';
import { TodoItemsJsonController } from './todo-items-json.controller';
import { TodoItemsJsonService } from './todo-items-json.service';

describe('TodoItemsJsonController', () => {
  let controller: TodoItemsJsonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoItemsJsonController],
      providers: [TodoItemsJsonService],
    }).compile();

    controller = module.get<TodoItemsJsonController>(TodoItemsJsonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
