import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SectionsTodoListService } from './sections-todo-list.service';
import { CreateSectionsTodoListDto } from './dto/create-sections-todo-list.dto';
import { UpdateSectionsTodoListDto } from './dto/update-sections-todo-list.dto';

@Controller('sections-todo-list')
export class SectionsTodoListController {
  constructor(private readonly sectionsTodoListService: SectionsTodoListService) {}

  @Post()
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSectionsTodoListDto: UpdateSectionsTodoListDto) {
    return this.sectionsTodoListService.update(+id, updateSectionsTodoListDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sectionsTodoListService.remove(+id);
  }
}
