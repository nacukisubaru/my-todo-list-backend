import { Injectable } from '@nestjs/common';
import { CreateTodoItemsJsonDto } from './dto/create-todo-items-json.dto';
import { InjectModel } from '@nestjs/sequelize';
import { TodoItemsJson } from './entities/todo-items-json.entity';

@Injectable()
export class TodoItemsJsonService {
  constructor(@InjectModel(TodoItemsJson) private todoItemsJsonRepo: typeof TodoItemsJson) { }
  
  async createJsons(userId: number) {
    return await this.todoItemsJsonRepo.bulkCreate([
      {jsonData: [], code: 'items', userId},
      {jsonData: [], code: 'todo-sections', userId},
      {jsonData: [], code: 'sections', userId},
    ]);
  }

  async addSectionsJson(createTodoItemsJsonDto: CreateTodoItemsJsonDto, userId: number) {
    return await this.todoItemsJsonRepo.update({...createTodoItemsJsonDto}, {where: {code: 'sections', userId}});
  }

  async addTodoSectionsJson(createTodoItemsJsonDto: CreateTodoItemsJsonDto, userId: number) {
    return await this.todoItemsJsonRepo.update({...createTodoItemsJsonDto}, {where: {code: 'todo-sections', userId}});
  }

  async addItemsJson(createTodoItemsJsonDto: CreateTodoItemsJsonDto, userId: number) {
    return await this.todoItemsJsonRepo.update({...createTodoItemsJsonDto}, {where: {code: 'items', userId}});
  }

  async findOneByCodeAndUser(code: string, userId: number) {
    return await this.todoItemsJsonRepo.findOne({where: {code, userId}});
  }

  async findAll() {
    return await this.todoItemsJsonRepo.findAll();
  }

  async remove(id: number) {
    return await this.todoItemsJsonRepo.update({jsonData: []}, {where: {id}});
  }
}
