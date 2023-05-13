import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { TodoItemsJsonService } from './todo-items-json.service';
import { CreateTodoItemsJsonDto } from './dto/create-todo-items-json.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('todo-items-json')
export class TodoItemsJsonController {
  constructor(private readonly todoItemsJsonService: TodoItemsJsonService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/addItems')
  addItems(@Body() createTodoItemsJsonDto: CreateTodoItemsJsonDto, @Req() request) {
    return this.todoItemsJsonService.addItemsJson(createTodoItemsJsonDto, request.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/addTodoSections')
  addTodoSections(@Body() createTodoItemsJsonDto: CreateTodoItemsJsonDto, @Req() request) {
    return this.todoItemsJsonService.addTodoSectionsJson(createTodoItemsJsonDto, request.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/addSections')
  addSections(@Body() createTodoItemsJsonDto: CreateTodoItemsJsonDto, @Req() request) {
    return this.todoItemsJsonService.addSectionsJson(createTodoItemsJsonDto, request.user.id);
  }

}
