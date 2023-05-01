import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TodoItemsJsonService } from './todo-items-json.service';
import { CreateTodoItemsJsonDto } from './dto/create-todo-items-json.dto';
import { UpdateTodoItemsJsonDto } from './dto/update-todo-items-json.dto';

@Controller('todo-items-json')
export class TodoItemsJsonController {
  constructor(private readonly todoItemsJsonService: TodoItemsJsonService) {}

  @Post('/addItems')
  addItems(@Body() createTodoItemsJsonDto: CreateTodoItemsJsonDto) {
    return this.todoItemsJsonService.addItemsJson(createTodoItemsJsonDto);
  }

  @Post('/addSections')
  addSections(@Body() createTodoItemsJsonDto: CreateTodoItemsJsonDto) {
    return this.todoItemsJsonService.addSectionsJson(createTodoItemsJsonDto);
  }

  @Get()
  findOne() {
    //return this.todoItemsJsonService.findOne();
  }

  @Post('/remove')
  remove() {
    //return this.todoItemsJsonService.remove();
  }
}
