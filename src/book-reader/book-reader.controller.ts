import { Controller, Get, Post, Body, UseInterceptors, UseGuards, UploadedFile, Query, Req } from '@nestjs/common';
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
    @Query('videoOnly') videoOnly: string,
    @Query('booksOnly') booksOnly: string,
    @Query('page') page: string,
  ) {
    const filter: IFilter = {
      searchByName,
      videoOnly: JSON.parse(videoOnly),
      booksOnly: JSON.parse(booksOnly),
    }
    return this.bookReaderService.getList(request.user.id, Number(page), filter);
  }

  @Get('/get-book')
  getBook(@Query('id') id: string, @Query('limitOnPage') limitOnPage: string) {
    if (limitOnPage) {
      return this.bookReaderService.getBook(+id, +limitOnPage);   
    }

    return this.bookReaderService.getBook(+id);
  }

  @Get('/get-video')
  getVideo(@Query('id') id: string, @Query('limitOnPage') limitOnPage: string) {
    if (limitOnPage) {
      return this.bookReaderService.getVideo(+id, +limitOnPage);
    }
    return this.bookReaderService.getVideo(+id);
  }

  @Post('/update-bookmarker')
  updateBookmark(@Body() updateBookReaderDto: UpdateBookReaderDto) {
    return this.bookReaderService.updateBookmarker(updateBookReaderDto.id, updateBookReaderDto.bookmarker);
  }

}
