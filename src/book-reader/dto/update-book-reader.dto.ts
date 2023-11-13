import { PartialType } from '@nestjs/mapped-types';
import { CreateBookReaderDto } from './create-book-reader.dto';

export class UpdateBookReaderDto extends PartialType(CreateBookReaderDto) {}
