import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookReaderDto } from './dto/create-book-reader.dto';
import { InjectModel } from '@nestjs/sequelize';
import { BookReader } from './entities/book-reader.entity';
import { FilesService } from 'src/files/files.service';
import * as path from 'path';
import { defaultLimitPage, paginate } from 'src/helpers/paginationHelper';
import { Op } from 'sequelize';
import { HttpService } from '@nestjs/axios';

interface IFile {
  fieldname: string,
  originalname: string,
  encoding: string,
  mimetype: string,
  buffer: BinaryData,
  size: number
}

export interface IFilter {
  searchByName: string,
  videoOnly: boolean,
  booksOnly: boolean
}

@Injectable()
export class BookReaderService {

  constructor(
    @InjectModel(BookReader) private bookReaderRepo: typeof BookReader,
    private filesService: FilesService,
    private readonly httpService: HttpService,
  ) {}

  async create(userId: number, createBookReaderDto: CreateBookReaderDto, file: IFile) {
    const book = await this.bookReaderRepo.findOne({where: {name: createBookReaderDto.name}});
    if (book) {
      throw new HttpException('книга или видео уже существует', HttpStatus.BAD_REQUEST);
    }
    const originalName = path.parse(file.originalname);
    const uploadedFile = this.filesService.createFile(file, 'books', originalName.ext, userId);
    return await this.bookReaderRepo.create({...createBookReaderDto, file: uploadedFile.filePathServer, userId})
  }

  async getList(userId: number, page: number, filter: IFilter = {searchByName: '', videoOnly: false, booksOnly: false}, limitPage: number = defaultLimitPage) {
    this.bookReaderRepo.findAll({where: {userId}});

    const prepareQuery: any = {where: { userId } };

    if (filter.videoOnly) {
      prepareQuery.where.isVideo = true;
    }

    if (filter.booksOnly) {
      prepareQuery.where.isVideo = false;
    }

    if (filter.searchByName) {
      prepareQuery.where.name = { [Op.iLike]: `%${filter.searchByName}%` };
    }

    const query: any = paginate(prepareQuery, page, limitPage);
    query.order = [['createdAt', 'DESC']];

    const books = await this.bookReaderRepo.findAndCountAll(query);
    if (books.rows.length <= 0) {
      throw new HttpException('Page not found', HttpStatus.NOT_FOUND);
    }

    const lastPage = Math.ceil(books.count / limitPage) - 1;
    let nextPage = 0;
    if (lastPage > 0) {
      nextPage = page + 1;
    }

    return { ...books, nextPage, lastPage };
  }

  async getContentFromFile(id: number, isVideo: boolean = false) {
    const book = await this.bookReaderRepo.findOne({where: {id, isVideo}});
    if (!book) {
      throw new HttpException('книга не найдена', HttpStatus.NOT_FOUND);
    }

    const file = await this.httpService.axiosRef.get(
      book.file,
    ).catch(function (error) {
      throw new HttpException(error.response.data, HttpStatus.BAD_REQUEST);
    });

    return file.data;
  }

  async getBook(id: number, limitOnPage: number = 500) {
    let content: string = await this.getContentFromFile(id);
    const arrayText = this.splitTextBySpanWords(content);
    
    let page = 1;
    let arr = [];
    let list = [];
    let start = 0;
    let end = limitOnPage;
    do {
      arr = arrayText.slice(start, end);
      list.push({text: arr.join(), page});
      start += limitOnPage;
      end += limitOnPage;
      page += 1;
    } while (arr.length);

    return list;
  }

  private splitTextBySpanWords (text: string) {
    const contentArray = []; 
    const wordsList = text.split(" ");
    for (let inc = 0; inc < wordsList.length; inc++) {
      let pattern = /[.=*\+\-\(),#$№%!@-]/g;
      let wordWithoutSymvols = wordsList[inc].replaceAll(pattern, "");
      if (wordWithoutSymvols.includes('\n')) {
        const wordsFromString = wordWithoutSymvols.split("\n");
        wordsFromString.map((word, key) => {
          if (!word) {
            contentArray.push('<br/>');
          } else {
            const withoutSymvols = word.replaceAll(pattern, "");
            contentArray.push(wordsFromString[key].replace(withoutSymvols, '<span class="translateMyWord">' + withoutSymvols + '</span>'));
          }
        })
      } else {
        let wordInSpan = '<span class="translateMyWord">' + wordWithoutSymvols + '</span>';
        contentArray.push(wordsList[inc].replace(wordWithoutSymvols, wordInSpan));
      }
    }
    
    return contentArray;
  }


  async getVideo(id: number) {
    let content: string = await this.getContentFromFile(id, true); 
  }

  async updateBookmarker(id: number, bookmarker: number) {
   return await this.bookReaderRepo.update({bookmarker}, {where: {id}});
  }
 
}
