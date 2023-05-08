import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SectionsTodoListService } from './sections-todo-list.service';
import { CreateSectionsTodoListDto } from './dto/create-sections-todo-list.dto';
import { UpdateSectionsTodoListDto } from './dto/update-sections-todo-list.dto';
import { RemoveSectionsTodoListDto } from './dto/remove-sections-todo-list.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
@Controller('sections-todo-list')
export class SectionsTodoListController {
  constructor(private readonly sectionsTodoListService: SectionsTodoListService) {}

  @Post('/create')
  create(@Body() createSectionsTodoListDto: CreateSectionsTodoListDto) {
    return this.sectionsTodoListService.create(createSectionsTodoListDto);
  }

  @Get('/getListBySection/:sectionId')
  getListBySection(@Param('sectionId') id: string) {
    return this.sectionsTodoListService.getListBySectionId(id);
  }

  @Get()
  findAll() {
    //return this.sectionsTodoListService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sectionsTodoListService.findOne(+id);
  }

  @Post('/update')
  update(@Body() updateSectionsTodoListDto: UpdateSectionsTodoListDto) {
    return this.sectionsTodoListService.update(updateSectionsTodoListDto);
  }

  @Post('/remove')
  remove(@Body() removeSectionDto: RemoveSectionsTodoListDto) {
    if (!removeSectionDto.id) {
      throw new HttpException('Не передан id', HttpStatus.BAD_REQUEST);
    }
    return this.sectionsTodoListService.remove(removeSectionDto.id);
  }
}
