import { Injectable } from '@nestjs/common';
import { CreateDictionaryExampleDto } from './dto/create-dictionary-example.dto';
import { UpdateDictionaryExampleDto } from './dto/update-dictionary-example.dto';
import { InjectModel } from '@nestjs/sequelize';
import { DictionaryExample } from './entities/dictionary-example.entity';
import { DictionariesExamples } from './entities/dictionaries-examples.entity';
import { YandexCloudService } from 'src/yandex-cloud/yandex-cloud.service';

@Injectable()
export class DictionaryExamplesService {

  constructor(
    @InjectModel(DictionaryExample) private dictionaryExampleRepo: typeof DictionaryExample,
    @InjectModel(DictionariesExamples) private dictionariesExamplesRepo: typeof DictionariesExamples,
    private yandexCloudSerivce: YandexCloudService
  ) {}

  async addExampleAndTranslate(dictionaryExampleDto: CreateDictionaryExampleDto, userId: number) {
    const {text, targetLanguageCode, type, dictionaryId} = dictionaryExampleDto;
    const example = await this.dictionaryExampleRepo.findOne({where: {originalText: text}});

    if (example) {
      await this.dictionariesExamplesRepo.create({dictionaryExampleId: example.id, dictionaryId, userId});
      return example.translatedText;
    }

    const translate = await this.yandexCloudSerivce.translate(text, targetLanguageCode, userId);
    if (translate) {
      const dictionaryExample = await this.dictionaryExampleRepo.create({
        originalText: translate.originalWord, 
        translatedText: translate.translatedWord,
        exampleType: type,
        showTranslate: false,
        languageOriginal: 'en',
        languageTranslation: targetLanguageCode,
        userId
      });
      
      await this.dictionariesExamplesRepo.create({dictionaryExampleId: dictionaryExample.id, dictionaryId, userId});
      return translate;
    }
  }

}
