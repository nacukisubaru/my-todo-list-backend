import { Module } from '@nestjs/common';
import { SectionsListService } from './sections-list.service';
import { SectionsListController } from './sections-todo-list.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { SectionsList } from './entities/sections-list.entity';

@Module({
  controllers: [SectionsListController],
  providers: [SectionsListService],
  imports:[
    SequelizeModule.forFeature([SectionsList]),
  ],
  exports: [
    SectionsListService
  ]
})
export class SectionsListModule {}
