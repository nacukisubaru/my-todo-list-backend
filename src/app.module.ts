import { Module } from '@nestjs/common';
import { TodoListModule } from './todo-list/todo-list.module';

@Module({
  imports: [TodoListModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
