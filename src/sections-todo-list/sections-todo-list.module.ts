import { Module } from '@nestjs/common';
import { SectionsTodoListService } from './sections-todo-list.service';
import { SectionsTodoListController } from './sections-todo-list.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { SectionsTodoList } from './entities/sections-todo-list.entity';

@Module({
  controllers: [SectionsTodoListController],
  providers: [SectionsTodoListService],
  imports:[
    SequelizeModule.forFeature([SectionsTodoList]),
  ],
  exports: [SectionsTodoListService]
})
export class SectionsTodoListModule {}
