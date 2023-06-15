import { Module } from '@nestjs/common';
import { DictionaryExamplesService } from './dictionary-examples.service';
import { DictionaryExamplesController } from './dictionary-examples.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { DictionaryExample } from './entities/dictionary-example.entity';
import { Dictionary } from 'src/dictionary/entities/dictionary.entity';
import { DictionariesExamples } from './entities/dictionaries-examples.entity';

@Module({
  controllers: [DictionaryExamplesController],
  providers: [DictionaryExamplesService],
  imports: [
    SequelizeModule.forFeature([DictionaryExample, Dictionary, DictionariesExamples]),
  ]
})
export class DictionaryExamplesModule {}
