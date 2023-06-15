import { Injectable } from '@nestjs/common';
import { CreateDictionaryExampleDto } from './dto/create-dictionary-example.dto';
import { UpdateDictionaryExampleDto } from './dto/update-dictionary-example.dto';

@Injectable()
export class DictionaryExamplesService {
  create(createDictionaryExampleDto: CreateDictionaryExampleDto) {
    return 'This action adds a new dictionaryExample';
  }

  findAll() {
    return `This action returns all dictionaryExamples`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dictionaryExample`;
  }

  update(id: number, updateDictionaryExampleDto: UpdateDictionaryExampleDto) {
    return `This action updates a #${id} dictionaryExample`;
  }

  remove(id: number) {
    return `This action removes a #${id} dictionaryExample`;
  }
}
