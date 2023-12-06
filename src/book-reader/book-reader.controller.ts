import { Controller, Get, Post, Body, UseInterceptors, UseGuards, UploadedFile, Query, Req, Delete } from '@nestjs/common';
import { BookReaderService, IFilter } from './book-reader.service';
import { CreateBookReaderDto } from './dto/create-book-reader.dto';
import { UpdateBookReaderDto } from './dto/update-book-reader.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('book-reader')
export class BookReaderController {
  constructor(private readonly bookReaderService: BookReaderService) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('/create')
  create(@Body() createBookReaderDto: CreateBookReaderDto, @UploadedFile() file, @Req() request) {
    return this.bookReaderService.create(request.user.id, createBookReaderDto, file);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/get-list-by-user')
  findAll(
    @Req() request,
    @Query('searchByName') searchByName: string,
    @Query('videoOnly') videoOnly: string = 'false',
    @Query('booksOnly') booksOnly: string = 'false',
    @Query('readOnly') readOnly: string = 'false',
    @Query('page') page: string = '1',
    @Query('limitPage') limitPage: string = '8',
    @Query('langOriginal') langOriginal: string = 'en'
  ) {
    const filter: IFilter = {
      searchByName,
      langOriginal,
      videoOnly: JSON.parse(videoOnly),
      booksOnly: JSON.parse(booksOnly),
      readOnly: JSON.parse(readOnly),
    }
    return this.bookReaderService.getList(request.user.id, Number(page), filter, +limitPage);
  }

  @Get('/get-book')
  getBook(
    @Query('id') id: string, 
    @Query('page') page: string = '1', 
    @Query('limitOnPage') limitOnPage: string = '500',
    @Query('getVideo') getVideo: string = 'false',
    @Query('timecode') timecode: string = ''
  ) {
    getVideo = JSON.parse(getVideo);
    if (getVideo) {
      return this.bookReaderService.getVideo(+id, +page, +limitOnPage, timecode);
    }
    return this.bookReaderService.getBook(+id, +page, +limitOnPage);   
  }


  @Post('/update-bookmarker')
  updateBookmark(@Body() updateBookReaderDto: UpdateBookReaderDto) {
    return this.bookReaderService.updateBookmarker(updateBookReaderDto.id, updateBookReaderDto.bookmarker);
  }

  @Post('/update-read')
  updateRead(@Body() updateBookReaderDto: UpdateBookReaderDto) {
    return this.bookReaderService.updateRead(updateBookReaderDto.id, updateBookReaderDto.isRead);
  }

  @Delete('/remove')
  remove(@Body('id') id: string) {
    return this.bookReaderService.removeBook(+id);
  }

}
