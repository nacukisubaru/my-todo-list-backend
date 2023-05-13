import { Module } from '@nestjs/common';
import { SectionsListService } from './sections-list.service';
import { SectionsListController } from './sections-todo-list.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { SectionsList } from './entities/sections-list.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [SectionsListController],
  providers: [SectionsListService],
  imports:[
    SequelizeModule.forFeature([SectionsList]),
    JwtModule
  ],
  exports: [
    SectionsListService
  ]
})
export class SectionsListModule {}
