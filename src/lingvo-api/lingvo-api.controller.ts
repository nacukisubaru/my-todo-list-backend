import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards } from '@nestjs/common';
import { LingvoApiService } from './lingvo-api.service';
import { CreateLingvoApiDto } from './dto/create-lingvo-api.dto';
import { UpdateLingvoApiDto } from './dto/update-lingvo-api.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('lingvo-api')
export class LingvoApiController {
  constructor(private readonly lingvoApiService: LingvoApiService) {}

  @Post()
  create(@Body() createLingvoApiDto: CreateLingvoApiDto) {
    return this.lingvoApiService.create(createLingvoApiDto);
  }

  @Get('/authorize')
  authorize() {
    return this.lingvoApiService.authorize();
  }

  @Get('/short-translate')
  shortTranslateWord(@Query('word') word: string, @Query('sourceLang') sourceLang: string, @Query('targetLang') targetLang: string) {
    return this.lingvoApiService.shortTranslateWord(word, sourceLang, targetLang);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/translate')
  translate(@Query('word') word: string, @Req() request) {
    return this.lingvoApiService.translate(word, request.user.id);
  }

  @Get()
  findAll() {
    return this.lingvoApiService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lingvoApiService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLingvoApiDto: UpdateLingvoApiDto) {
    return this.lingvoApiService.update(+id, updateLingvoApiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lingvoApiService.remove(+id);
  }
}
