import { Module } from '@nestjs/common';
import { TodoListService } from './todo-list.service';
import { TodoListController } from './todo-list.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { TodoList } from './entities/todo-list.entity';
import { SectionsTodoListModule } from 'src/sections-todo-list/sections-todo-list.module';
import { SectionsTodoList } from 'src/sections-todo-list/entities/sections-todo-list.entity';
import { TodoItemsJsonModule } from 'src/todo-items-json/todo-items-json.module';
import { TodoItemsJson } from 'src/todo-items-json/entities/todo-items-json.entity';

@Module({
  controllers: [TodoListController],
  providers: [TodoListService],
  imports: [
    SequelizeModule.forFeature([TodoList, SectionsTodoList, TodoItemsJson]),
    SectionsTodoListModule,
    TodoItemsJsonModule
  ]
})
export class TodoListModule {}
