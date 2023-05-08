import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TodoListService } from './todo-list.service';
import { CreateTodoListDto } from './dto/create-todo-list.dto';
import { UpdateTodoListDto } from './dto/update-todo-list.dto';

@Controller('todo-list')
export class TodoListController {
  constructor(private readonly todoListService: TodoListService) { }

  @Get('/updTodosPositions')
  updateTodosPositions() {
    this.todoListService.updatePositions();
  }

  @Post('/create')
  create(@Body() createTodoListDto: CreateTodoListDto) {
    return this.todoListService.create(createTodoListDto);
  }

  @Get('/by-section')
  getBySectionAll(@Query('id') id: string) {
    return this.todoListService.getTodosWithSections(id);
  }

  @Post('/updateSort')
  updateSort(@Body() todoList: CreateTodoListDto[]) {
    this.todoListService.updateSortPositions(todoList);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todoListService.findOne(+id);
  }

  @Post('/update')
  update(@Body() updateTodoListDto: UpdateTodoListDto) {
    return this.todoListService.update(updateTodoListDto);
  }

  @Post('/remove')
  remove(@Body() ids: string[]) {
    return this.todoListService.remove(ids);
  }
}
