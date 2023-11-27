import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookReaderDto } from './dto/create-book-reader.dto';
import { InjectModel } from '@nestjs/sequelize';
import { BookReader } from './entities/book-reader.entity';
import { FilesService } from 'src/files/files.service';
import * as path from 'path';
import { defaultLimitPage, paginate } from 'src/helpers/paginationHelper';
import { Op } from 'sequelize';
import { HttpService } from '@nestjs/axios';
import { convertSecoundsToTimeString, convertTimeStringToSeconds, getTimePeriod } from 'src/helpers/dateTimeHelper';

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

interface ITimecodeByString {
  text: string,
  timecode: string
}

interface ISubtitle {
  text: string,
  timecodes: string[],
  timecodesByString: ITimecodeByString[]
  subtitlePage?: number,
  page: number
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
    query.order = [['id', 'DESC']];

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
    const arrayText = this.splitTextBySpanWords(content.content, false);

    let arr = [];
    const { start, end } = this.calculateSliceIndexesByPage(limitOnPage, page);

    arr = arrayText.slice(start, end);
    return { text: arr.join(" "), page, countPages: Math.round(arrayText.length / limitOnPage) + 1, book: content.book };
  }

  private splitTextBySpanWords(text: string, getSpanIds: boolean = false) {
    const contentArray = [];
    const spanIds = [];

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
              let spanId = withoutSymvols + key + inc;
              spanIds.push(spanId);
              contentArray.push(wordsFromString[key].replace(withoutSymvols, `<span id="${spanId}" class="translateMyWord">` + withoutSymvols + '</span>'));
            }
          })
        } else {
          let pattern = /[.=*\+\(),“”""#$№%!&*;|:~<>?@]/g;
          let wordWithoutSymvols = wordsList[inc].replaceAll(pattern, "");
          let spanId = wordWithoutSymvols + inc;
          spanIds.push(spanId);
          let wordInSpan = `<span id="${spanId}" class="translateMyWord">` + wordWithoutSymvols + '</span>';
          contentArray.push(wordsList[inc].replace(wordWithoutSymvols, wordInSpan));
        }
      }
    }

    if (getSpanIds) {
      return spanIds;
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
    let arrContent: string[] = content.content.split("\n").filter(item => item !== "");
    arrContent = arrContent.filter(content => new RegExp(/[a-z A-Z ,.: -->]/).test(content));
    let startInc = 0;
    let endInc = 1;
    let chunks = [];
    let curPage = 1;
    let inc = 0;

    let currentSpanIds = '';
    let currentTimecodes = [];
    let countStrings = 0;

    const subtitles = <ISubtitle[]>[];
    do {
      chunks = arrContent.slice(startInc, endInc);
      if (chunks.length) {
        let text = '';
        let timecodes = [];
        let timecodesByString = [];

        chunks.map(chunk => {
          currentSpanIds = '';
          if (chunk.includes("-->")) {
            currentTimecodes = [];
            const times: string[] = chunk.split("-->");
            const periods = getTimePeriod(times[0].split(',')[0].trim(), times[1].split(',')[0].trim());
            periods.map(period => {
              currentTimecodes.push(period);
              timecodes.push(period);
            })

            times.map((time) => {
              const modifTime = time.split(',')[0].trim();
              currentTimecodes.push(modifTime);
              timecodes.push(modifTime);
            });

          } else {
            currentSpanIds += this.splitTextBySpanWords(chunk, true).join(" ");
            text += `<span id="${currentSpanIds}">`+this.splitTextBySpanWords(chunk).join(" ") + '</span>' + '<br/>';
          }
       
        });

        if (currentSpanIds && currentTimecodes.length) {
          currentTimecodes.map((timecode) => {
            timecodesByString.push({spanIds: currentSpanIds, timecode});
          });
        }

        if (countStrings === 2) {
          countStrings = 0;
          currentSpanIds = '';
          currentTimecodes = [];
        }

        subtitles.push({ text, timecodes, timecodesByString, page: curPage });
        startInc++;
        endInc++;
        inc++;
        if (inc === limitOnPage) {
          curPage++;
          inc = 0;
        }
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
      let timecodePage = this.findByTimecode(subtitles, timecode, limitOnPage);

      if (!timecodePage) {
        let time = convertTimeStringToSeconds(timecode);
        while (!timecodePage) {
          time++;
          timecodePage = this.findByTimecode(subtitles, convertSecoundsToTimeString(time), limitOnPage);
        }
      }

      const indexes = this.calculateSliceIndexesByPage(limitOnPage, timecodePage);
      subtitlesData = subtitles.slice(indexes.start, indexes.end);
      page = timecodePage;
    }

    let timecodesByString = [];
    subtitlesData.map(subtitle => {
      text += subtitle.text;
      timecodesByString = subtitle.timecodesByString.concat(timecodesByString);
      timecodes = subtitle.timecodes.concat(timecodes);
    });

    timecodes.sort(function (a, b) {
      return convertTimeStringToSeconds(a) - convertTimeStringToSeconds(b);
    })

    return { text, page, timecodes, timecodesByString, book: content.book, countPages };
  }

  private findByTimecode = (subtitles: ISubtitle[], timecode: string, limitOnPage: number) => {
    let timecodePage = 0;
 
    const findedSub = subtitles.filter(sub => sub.timecodes.includes(timecode));
    if (findedSub.length) {
      timecodePage = findedSub[0].page
    }
    return timecodePage;
  }

  async updateBookmarker(id: number, bookmarker: number) {
    return await this.bookReaderRepo.update({ bookmarker }, { where: { id } });
  }

  async updateRead(id: number, isRead: boolean) {
    return await this.bookReaderRepo.update({ isRead }, { where: { id } });
  }

}
