import { Test, TestingModule } from '@nestjs/testing';
import { TodoItemsJsonService } from './todo-items-json.service';

describe('TodoItemsJsonService', () => {
  let service: TodoItemsJsonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TodoItemsJsonService],
    }).compile();

    service = module.get<TodoItemsJsonService>(TodoItemsJsonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
