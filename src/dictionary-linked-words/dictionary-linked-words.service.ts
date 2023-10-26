import { Injectable } from '@nestjs/common';
import { CreateDictionaryLinkedWordDto } from './dto/create-dictionary-linked-word.dto';
import { UpdateDictionaryLinkedWordDto } from './dto/update-dictionary-linked-word.dto';
import { DictionaryLinkedWord } from './entities/dictionary-linked-word.entity';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class DictionaryLinkedWordsService {

  constructor(
    @InjectModel(DictionaryLinkedWord) private dictionaryLinkedWordRepo: typeof DictionaryLinkedWord,
  ) {}

  async create(words: string[], wordsToRemove: string[] = [], dictionaryId: string) {
    let dataForCreate = words.map(word => {
      return {word, dictionaryId};
    });

    const dictionaryLinkedWords = await this.getListByDictionaryId(dictionaryId);
    if (dictionaryLinkedWords.length) {
      const linkedWords = dictionaryLinkedWords.map(word => word.word);
      if (dictionaryLinkedWords) {
        dataForCreate = dataForCreate.filter(data => !linkedWords.includes(data.word));
      }
    }
    
    if (wordsToRemove.length) {
      await this.dictionaryLinkedWordRepo.destroy({where: {word: wordsToRemove, dictionaryId}});
    }

    return await this.dictionaryLinkedWordRepo.bulkCreate(dataForCreate);
  }

  async getListByDictionaryId(dictionaryId: string) {
    return await this.dictionaryLinkedWordRepo.findAll({where: {dictionaryId}});
  }

  remove(id: number) {
    return `This action removes a #${id} dictionaryLinkedWord`;
  }
}
