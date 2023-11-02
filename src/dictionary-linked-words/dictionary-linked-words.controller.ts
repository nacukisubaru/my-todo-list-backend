import { Controller, Post, Body } from '@nestjs/common';
import { DictionaryLinkedWordsService } from './dictionary-linked-words.service';
import { CreateDictionaryLinkedWordDto } from './dto/create-dictionary-linked-word.dto';

@Controller('dictionary-linked-words')
export class DictionaryLinkedWordsController {
  constructor(private readonly dictionaryLinkedWordsService: DictionaryLinkedWordsService) {}

  @Post('/create')
  create(@Body() createDictionaryLinkedWordDto: CreateDictionaryLinkedWordDto) {
    const {dictionaryId, words} = createDictionaryLinkedWordDto
    return this.dictionaryLinkedWordsService.create(words, dictionaryId);
  }

}
