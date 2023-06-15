import { PartialType } from '@nestjs/mapped-types';
import { CreateDictionaryExampleDto } from './create-dictionary-example.dto';

export class UpdateDictionaryExampleDto extends PartialType(CreateDictionaryExampleDto) {}
