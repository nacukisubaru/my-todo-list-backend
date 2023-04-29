import { PartialType } from '@nestjs/mapped-types';
import { CreateSectionsTodoListDto } from './create-sections-todo-list.dto';

export class UpdateSectionsTodoListDto extends PartialType(CreateSectionsTodoListDto) {}
