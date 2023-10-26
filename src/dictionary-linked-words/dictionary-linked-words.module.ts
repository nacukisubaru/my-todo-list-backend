import { Module } from '@nestjs/common';
import { DictionaryLinkedWordsService } from './dictionary-linked-words.service';
import { DictionaryLinkedWordsController } from './dictionary-linked-words.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { DictionaryLinkedWord } from './entities/dictionary-linked-word.entity';
import { Dictionary } from 'src/dictionary/entities/dictionary.entity';
import { DictionariesLinkedWords } from './entities/dictionary-linked-words.entity';

@Module({
  controllers: [DictionaryLinkedWordsController],
  providers: [DictionaryLinkedWordsService],
  imports: [
    SequelizeModule.forFeature([DictionaryLinkedWord, DictionariesLinkedWords])
  ]
})
export class DictionaryLinkedWordsModule {}
