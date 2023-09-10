import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateDictionaryDto } from './dto/create-dictionary.dto';
import { UpdateDictionaryDto } from './dto/update-dictionary.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Dictionary } from './entities/dictionary.entity';
import { defaultLimitPage, paginate } from 'src/helpers/paginationHelper';
import { Op } from 'sequelize';
import { DictionarySettingsService } from 'src/dictionary-settings/dictionary-settings.service';

export type studyStageType = "NOT_STUDIED" | "BEING_STUDIED" | "STUDIED";
export interface IFilterDictionary {
  languageOriginal?: string | string[],
  languageTranslation?: string | string[],
  studyStage?: studyStageType,
  searchByOriginal?: string,
  searchByTranslate?: string
}

@Injectable()
export class DictionaryService {

  constructor(
    @InjectModel(Dictionary) private dictionaryRepo: typeof Dictionary,
  ) { }

  async create(createDictionaryDto: CreateDictionaryDto, userId: number) {
    const isExistWord = await this.dictionaryRepo.findOne({ 
      where: { 
        originalWord: createDictionaryDto.originalWord, 
        translatedWord: createDictionaryDto.translatedWord 
      }
    });
    
    if (isExistWord) {
      throw new HttpException('Слово уже есть в словаре', HttpStatus.BAD_REQUEST);
    }
    
    return await this.dictionaryRepo.create({
      ...createDictionaryDto,
      studyStage: 'BEING_STUDIED', 
      userId 
    });
  }

  async getListByUser(userId: number, page: number, filter: IFilterDictionary = {}, limitPage: number = defaultLimitPage) {
    const prepareQuery: any = { include: { nested: true, all: true }, where: { userId } };

    if (filter.languageTranslation) {
      prepareQuery.where.languageTranslation = filter.languageTranslation;
    }

    if (filter.languageOriginal) {
      prepareQuery.where.languageOriginal = filter.languageOriginal;
    }

    if (filter.studyStage) {
      prepareQuery.where.studyStage = filter.studyStage;
    }

    if (filter.searchByOriginal) {
      prepareQuery.where.originalWord = { [Op.iLike]: `%${filter.searchByOriginal}%` };
    }

    if (filter.searchByTranslate) {
      prepareQuery.where.translatedWord = { [Op.iLike]: `%${filter.searchByTranslate}%` };
    }

    const query: any = paginate(prepareQuery, page, limitPage);
    query.order = [['createdAt', 'DESC']];

    const dictionaryList = await this.dictionaryRepo.findAndCountAll(query);
    if (dictionaryList.rows.length <= 0) {
      throw new HttpException('Page not found', HttpStatus.NOT_FOUND);
    }

    const lastPage = Math.ceil(dictionaryList.count / limitPage) - 1;
    let nextPage = 0;
    if (lastPage > 0) {
      nextPage = page + 1;
    }

    return { ...dictionaryList, nextPage, lastPage };
  }

  async updateStudyStage(id: string, studyStage: studyStageType) {
    return await this.dictionaryRepo.update({ studyStage }, { where: { id } })
  }

  findOne(id: number) {
    return `This action returns a #${id} dictionary`;
  }

  update(id: number, updateDictionaryDto: UpdateDictionaryDto) {
    return `This action updates a #${id} dictionary`;
  }

  remove(id: number) {
    return `This action removes a #${id} dictionary`;
  }
}
