import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateDictionaryDto } from './dto/create-dictionary.dto';
import { UpdateDictionaryDto } from './dto/update-dictionary.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Dictionary } from './entities/dictionary.entity';
import { defaultLimitPage, paginate } from 'src/helpers/paginationHelper';

@Injectable()
export class DictionaryService {

  constructor(
    @InjectModel(Dictionary) private dictionaryRepo: typeof Dictionary
  ) {}

  async create(createDictionaryDto: CreateDictionaryDto, userId: number) {
    return await this.dictionaryRepo.create({...createDictionaryDto, isStudy: true, userId});
  }

  async getListByUser(userId: number, page: number, limitPage: number = defaultLimitPage) {
    const query: any = paginate({where: {userId}}, page, limitPage);
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
