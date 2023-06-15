import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DictionaryExamplesService } from './dictionary-examples.service';
import { CreateDictionaryExampleDto } from './dto/create-dictionary-example.dto';
import { UpdateDictionaryExampleDto } from './dto/update-dictionary-example.dto';

@Controller('dictionary-examples')
export class DictionaryExamplesController {
  constructor(private readonly dictionaryExamplesService: DictionaryExamplesService) {}

  @Post()
  create(@Body() createDictionaryExampleDto: CreateDictionaryExampleDto) {
    return this.dictionaryExamplesService.create(createDictionaryExampleDto);
  }

  @Get()
  findAll() {
    return this.dictionaryExamplesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dictionaryExamplesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDictionaryExampleDto: UpdateDictionaryExampleDto) {
    return this.dictionaryExamplesService.update(+id, updateDictionaryExampleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dictionaryExamplesService.remove(+id);
  }
}
