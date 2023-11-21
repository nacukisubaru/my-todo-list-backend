import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookReaderDto } from './dto/create-book-reader.dto';
import { InjectModel } from '@nestjs/sequelize';
import { BookReader } from './entities/book-reader.entity';
import { FilesService } from 'src/files/files.service';
import * as path from 'path';
import { defaultLimitPage, paginate } from 'src/helpers/paginationHelper';
import { Op } from 'sequelize';
import { HttpService } from '@nestjs/axios';
import { spliceIntoChunks } from 'src/helpers/arrayHelper';
import sequelize from 'sequelize';

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
  booksOnly: boolean,
  readOnly: boolean,
  langOriginal: string
}

interface ISubtitle {
  text: string,
  timecodes: string[],
  subtitlePage?: number
}

@Injectable()
export class BookReaderService {

  constructor(
    @InjectModel(BookReader) private bookReaderRepo: typeof BookReader,
    private filesService: FilesService,
    private readonly httpService: HttpService,
  ) { }

  async create(userId: number, createBookReaderDto: CreateBookReaderDto, file: IFile) {
    const book = await this.bookReaderRepo.findOne({ where: { name: createBookReaderDto.name } });
    if (book) {
      throw new HttpException('книга или видео уже существует', HttpStatus.BAD_REQUEST);
    }

    const originalName = path.parse(file.originalname);
    let isVideo: any = createBookReaderDto.isVideo;
    isVideo = JSON.parse(isVideo);

    if (isVideo && originalName.ext !== '.srt') {
      throw new HttpException('не возможно добавить видео без файла субтитров типа srt', HttpStatus.BAD_REQUEST);
    }

    const uploadedFile = this.filesService.createFile(file, 'books', originalName.ext, userId);
    return await this.bookReaderRepo.create({ ...createBookReaderDto, isVideo, file: uploadedFile.filePathServer, userId })
  }

  async getList(userId: number, page: number = 1, filter: IFilter = { searchByName: '', langOriginal: '', videoOnly: false, booksOnly: false, readOnly: false }, limitPage: number = defaultLimitPage) {
    this.bookReaderRepo.findAll({ where: { userId } });

    page = page - 1;
    const prepareQuery: any = { where: { userId } };

    if (filter.videoOnly) {
      prepareQuery.where.isVideo = filter.videoOnly;
    }

    if (filter.booksOnly) {
      prepareQuery.where.isVideo = false;
    }

    if (filter.searchByName) {
      prepareQuery.where.name = { [Op.iLike]: `%${filter.searchByName}%` };
    }

    if (filter.readOnly) {
      prepareQuery.where.isRead = true;
    }

    if (filter.langOriginal) {
      prepareQuery.where.langOriginal = filter.langOriginal;
    }

    const query: any = paginate(prepareQuery, page, limitPage);
    query.order = [['id', 'ASC']];

    const books = await this.bookReaderRepo.findAndCountAll(query);
    if (books.rows.length <= 0) {
      throw new HttpException('Page not found', HttpStatus.NOT_FOUND);
    }

    const pages = Math.ceil(books.count / limitPage);

    const lastPage = pages - 1;
    let nextPage = 0;
    if (lastPage > 0) {
      nextPage = page + 1;
    }

    return { ...books, nextPage, lastPage, pages };
  }

  async getContentFromFile(id: number, isVideo: boolean = false) {
    const book = await this.bookReaderRepo.findOne({ where: { id, isVideo } });
    if (!book) {
      throw new HttpException(`${isVideo ? 'видео' : 'книга'} не найдена`, HttpStatus.NOT_FOUND);
    }

    if (!book.file) {
      throw new HttpException('файл не найден', HttpStatus.NOT_FOUND);
    }

    const file = await this.httpService.axiosRef.get(
      book.file,
    ).catch(function (error) {
      throw new HttpException(error.response.data, HttpStatus.BAD_REQUEST);
    });

    return { content: file.data, book };
  }

  async getBook(id: number, page: number = 1, limitOnPage: number = 500) {
    let content = await this.getContentFromFile(id);
    const arrayText = this.splitTextBySpanWords(content.content);

    let arr = [];
    const { start, end } = this.calculateSliceIndexesByPage(limitOnPage, page);

    arr = arrayText.slice(start, end);
    return { text: arr.join(" "), page, countPages: Math.round(arrayText.length / limitOnPage) + 1, book: content.book };
  }

  private splitTextBySpanWords(text: string) {
    const contentArray = [];
    if (text) {
      const wordsList = text.split(" ");

      for (let inc = 0; inc < wordsList.length; inc++) {

        if (wordsList[inc].includes('\n')) {
          const wordsFromString = wordsList[inc].split("\n");
          wordsFromString.map((word, key) => {
            if (!word) {
              contentArray.push('<br/>');
            } else {
              let pattern = /[.=*\+\(),“”""#$№%!&*;|:~<>?@]/g;
              const withoutSymvols = word.replaceAll(pattern, "");
              contentArray.push(wordsFromString[key].replace(withoutSymvols, `<span id="${withoutSymvols + key + inc}" class="translateMyWord">` + withoutSymvols + '</span>'));
            }
          })
        } else {
          let pattern = /[.=*\+\(),“”""#$№%!&*;|:~<>?@]/g;
          let wordWithoutSymvols = wordsList[inc].replaceAll(pattern, "");
          let wordInSpan = `<span id="${wordWithoutSymvols + inc}" class="translateMyWord">` + wordWithoutSymvols + '</span>';
          contentArray.push(wordsList[inc].replace(wordWithoutSymvols, wordInSpan));
        }
      }
    }
    return contentArray;
  }

  private calculateSliceIndexesByPage(limitOnPage: number, page: number) {
    const startPage = limitOnPage * page;
    let start = startPage === limitOnPage ? 0 : startPage - limitOnPage;
    let end = startPage;
    return { start, end };
  }

  async getVideo(id: number, page: number = 1, limitOnPage: number = 20, timecode: string = '') {
    let content = await this.getContentFromFile(id, true);
    const arrContent = content.content.split("\n").filter(item => item !== "");
    const contentChunks = spliceIntoChunks(arrContent, 3);

    let startInc = 0;
    let endInc = limitOnPage;
    let chunks = [];

    const subtitles = <ISubtitle[]>[];
    do {
      chunks = contentChunks.slice(startInc, endInc);
      if (chunks.length) {
        let text = '';
        let timecodes = [];
        chunks.map(chunk => {
          text += this.splitTextBySpanWords(chunk[2]).join() + '<br/>';
          timecodes.push(chunk[1].split("-->")[0].split(',')[0]);
        })
        subtitles.push({ text, timecodes });
        startInc += limitOnPage;
        endInc += limitOnPage;
      }
    }
    while (chunks.length);

    const countPages = Math.round(subtitles.length / limitOnPage)

    let start = 0;
    let end = 0;
    let text = '';
    let timecodes = [];
    let subtitlesData: ISubtitle[] = [];
    if (!timecode) {
      const indexes = this.calculateSliceIndexesByPage(limitOnPage, page);
      start = indexes.start;
      end = indexes.end;
      subtitlesData = subtitles.slice(start, end);
    } else {
      let incPage = 1;
      let timecodePage = 0;
      do {
        const indexes = this.calculateSliceIndexesByPage(limitOnPage, incPage);
        subtitlesData = subtitles.slice(indexes.start, indexes.end);

        subtitlesData.map(subtitle => {
          if (subtitle.timecodes.includes(timecode)) {
              timecodePage = incPage;
          }
        })
        incPage++;

      }
      while (!timecodePage)

      page = timecodePage;
    }

    subtitlesData.map(subtitle => {
      text += subtitle.text;
      timecodes = subtitle.timecodes.concat(timecodes);
    });

    return { text, page, timecodes, book: content.book, countPages };
  }

  async updateBookmarker(id: number, bookmarker: number) {
    return await this.bookReaderRepo.update({ bookmarker }, { where: { id } });
  }

  async updateRead(id: number, isRead: boolean) {
    return await this.bookReaderRepo.update({ isRead }, { where: { id } });
  }

}
