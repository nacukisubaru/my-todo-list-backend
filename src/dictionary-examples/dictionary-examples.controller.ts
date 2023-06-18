import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { DictionaryExamplesService } from './dictionary-examples.service';
import { CreateDictionaryExampleDto } from './dto/create-dictionary-example.dto';
import { UpdateDictionaryExampleDto } from './dto/update-dictionary-example.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('dictionary-examples')
export class DictionaryExamplesController {
  constructor(private readonly dictionaryExamplesService: DictionaryExamplesService) {}
  
  @Post('/create-example-and-translate')
  @UseGuards(JwtAuthGuard)
  createExampleAndTranslate(@Body() createDictionaryExampleDto: CreateDictionaryExampleDto, @Req() request) {
    return this.dictionaryExamplesService.addExampleAndTranslate(createDictionaryExampleDto, request.user.id);
  }


}
