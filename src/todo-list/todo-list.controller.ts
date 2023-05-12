import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { TodoListService } from './todo-list.service';
import { CreateTodoListDto } from './dto/create-todo-list.dto';
import { UpdateTodoListDto } from './dto/update-todo-list.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('todo-list')
export class TodoListController {
  constructor(private readonly todoListService: TodoListService) { }

  @UseGuards(JwtAuthGuard)
  @Get('/updTodosPositions')
  updateTodosPositions(@Req() request ) {
    this.todoListService.updatePositions(request.user.id);
  }

  @Post('/create')
  create(@Body() createTodoListDto: CreateTodoListDto) {
    return this.todoListService.create(createTodoListDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/by-section')
  getBySectionAll(@Query('id') id: string) {
    return this.todoListService.getTodosWithSections(id);
  }

  @Post('/updateSort')
  updateSort(@Body() todoList: CreateTodoListDto[]) {
    this.todoListService.updateSortPositions(todoList);
  }

  @Get('/getById')
  findOne(@Query('id') id: string) {
    return this.todoListService.findOne(id);
  }

  @Post('/update')
  update(@Body() updateTodoListDto: UpdateTodoListDto) {
    return this.todoListService.update(updateTodoListDto);
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('/remove')
  remove(@Body() ids: string[], @Req() request) {
    return this.todoListService.remove(ids, request.user.id);
  }
}
