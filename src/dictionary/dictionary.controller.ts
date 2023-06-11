import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { DictionaryService } from './dictionary.service';
import { CreateDictionaryDto } from './dto/create-dictionary.dto';
import { UpdateDictionaryDto } from './dto/update-dictionary.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('dictionary')
export class DictionaryController {
  constructor(private readonly dictionaryService: DictionaryService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createDictionaryDto: CreateDictionaryDto, @Req() request) {
    return this.dictionaryService.create(createDictionaryDto, request.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/get-list-by-user')
  getListByUser(@Req() request, @Query('page') page: string) {
    return this.dictionaryService.getListByUser(request.user.id, Number(page));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dictionaryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDictionaryDto: UpdateDictionaryDto) {
    return this.dictionaryService.update(+id, updateDictionaryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dictionaryService.remove(+id);
  }
}
