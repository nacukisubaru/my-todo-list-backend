import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { DictionaryService, IFilterDictionary, studyStageType } from './dictionary.service';
import { CreateDictionaryDto } from './dto/create-dictionary.dto';
import { UpdateDictionaryDto } from './dto/update-dictionary.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('dictionary')
export class DictionaryController {
  constructor(private readonly dictionaryService: DictionaryService) { }

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  create(@Body() createDictionaryDto: CreateDictionaryDto, @Req() request) {
    return this.dictionaryService.create(createDictionaryDto, request.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/get-list-by-user')
  getListByUser(
    @Req() request,
    @Query('languageOriginal') languageOriginal: string,
    @Query('languageTranslation') languageTranslation: string,
    @Query('searchByOriginal') searchByOriginal: string,
    @Query('searchByTranslate') searchByTranslate: string,
    @Query('studyStage') studyStage: studyStageType,
    @Query('page') page: any
  ) {
    if (!page) {
      page = 0;
    }
    const filter: IFilterDictionary = { 
      languageOriginal, 
      languageTranslation, 
      studyStage, 
      searchByOriginal, 
      searchByTranslate 
    };
    return this.dictionaryService.getListByUser(request.user.id, Number(page), filter);
  }

  @Post('/update-study-stage')
  update(@Body() updateDictionaryDto: UpdateDictionaryDto) {
    return this.dictionaryService.updateStudyStage(updateDictionaryDto.id, updateDictionaryDto.studyStage);
  }

  @Post('/update-notes')
  updateNotes(@Body() updateDictionaryDto: UpdateDictionaryDto) {
    return this.dictionaryService.updateNotes(updateDictionaryDto.id, updateDictionaryDto.notes);
  }
  

  @Post('/update-word')
  updateWord(@Body() updateDictionaryDto: UpdateDictionaryDto) {
    return this.dictionaryService.updateWord(updateDictionaryDto.id, updateDictionaryDto.originalWord);
  }
}
