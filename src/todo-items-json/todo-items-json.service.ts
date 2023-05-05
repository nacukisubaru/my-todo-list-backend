import { Injectable } from '@nestjs/common';
import { CreateTodoItemsJsonDto } from './dto/create-todo-items-json.dto';
import { InjectModel } from '@nestjs/sequelize';
import { TodoItemsJson } from './entities/todo-items-json.entity';

@Injectable()
export class TodoItemsJsonService {
  constructor(@InjectModel(TodoItemsJson) private todoItemsJsonRepo: typeof TodoItemsJson) { }

  async addSectionsJson(createTodoItemsJsonDto: CreateTodoItemsJsonDto) {
    return await this.todoItemsJsonRepo.update({...createTodoItemsJsonDto}, {where: {code: 'sections'}});
  }

  async addTodoSectionsJson(createTodoItemsJsonDto: CreateTodoItemsJsonDto) {
    return await this.todoItemsJsonRepo.update({...createTodoItemsJsonDto}, {where: {code: 'todo-sections'}});
  }

  async addItemsJson(createTodoItemsJsonDto: CreateTodoItemsJsonDto) {
    return await this.todoItemsJsonRepo.update({...createTodoItemsJsonDto}, {where: {code: 'items'}});
  }

  async findOneByCode(code: string) {
    return await this.todoItemsJsonRepo.findOne({where: {code}});
  }

  async findAll() {
    return await this.todoItemsJsonRepo.findAll();
  }

  async remove(id: number) {
    return await this.todoItemsJsonRepo.update({jsonData: []}, {where: {id}});
  }
}
