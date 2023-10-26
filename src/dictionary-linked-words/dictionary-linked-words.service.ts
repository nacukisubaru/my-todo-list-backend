import { Injectable } from '@nestjs/common';
import { CreateDictionaryLinkedWordDto } from './dto/create-dictionary-linked-word.dto';
import { UpdateDictionaryLinkedWordDto } from './dto/update-dictionary-linked-word.dto';
import { DictionaryLinkedWord } from './entities/dictionary-linked-word.entity';
import { InjectModel } from '@nestjs/sequelize';
import { DictionariesLinkedWords } from './entities/dictionary-linked-words.entity';
import { where } from 'sequelize';

@Injectable()
export class DictionaryLinkedWordsService {

  constructor(
    @InjectModel(DictionaryLinkedWord) private dictionaryLinkedWordRepo: typeof DictionaryLinkedWord,
    @InjectModel(DictionariesLinkedWords) private dictionariesLinkedWordsRepo: typeof DictionariesLinkedWords,
  ) {}

  async create(words: string[], dictionaryId: string) {   

    const wordsObj = words.map(word => {
      return {word};
    })

    const records = await this.dictionariesLinkedWordsRepo.findAll({where: {dictionaryId}}); 
    const linkedWordsIds = records.map(record => record.dictionaryLinkedWordId);
    await this.dictionariesLinkedWordsRepo.destroy({where: {dictionaryId}});
    await this.dictionaryLinkedWordRepo.destroy({where: {id: linkedWordsIds}});
    
    const createdWords = await this.dictionaryLinkedWordRepo.bulkCreate(wordsObj);

    const dataForCreate =  createdWords.map(word => {
      return {dictionaryLinkedWordId: word.id, dictionaryId};
    });

    await this.dictionariesLinkedWordsRepo.bulkCreate(dataForCreate);
  }

  async getListByDictionaryId(dictionaryId: string) {
   // return await this.dictionaryLinkedWordRepo.findAll({where: {dictionaryId}});
  }

  remove(id: number) {
    return `This action removes a #${id} dictionaryLinkedWord`;
  }
}
