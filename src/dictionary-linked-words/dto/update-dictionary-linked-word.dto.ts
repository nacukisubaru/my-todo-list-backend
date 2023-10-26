import { PartialType } from '@nestjs/mapped-types';
import { CreateDictionaryLinkedWordDto } from './create-dictionary-linked-word.dto';

export class UpdateDictionaryLinkedWordDto extends PartialType(CreateDictionaryLinkedWordDto) {}
