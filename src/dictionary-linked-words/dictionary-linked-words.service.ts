import { Injectable } from '@nestjs/common';
import { DictionaryLinkedWord } from './entities/dictionary-linked-word.entity';
import { InjectModel } from '@nestjs/sequelize';
import { DictionariesLinkedWords } from './entities/dictionary-linked-words.entity';

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

}
