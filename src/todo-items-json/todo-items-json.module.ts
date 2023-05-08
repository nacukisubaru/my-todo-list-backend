import { Module } from '@nestjs/common';
import { TodoItemsJsonService } from './todo-items-json.service';
import { TodoItemsJsonController } from './todo-items-json.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { TodoItemsJson } from './entities/todo-items-json.entity';

@Module({
  controllers: [TodoItemsJsonController],
  providers: [TodoItemsJsonService],
  imports:[
    SequelizeModule.forFeature([TodoItemsJson]),
  ],
  exports: [TodoItemsJsonService]
})
export class TodoItemsJsonModule {}
