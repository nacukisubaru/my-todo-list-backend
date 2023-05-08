import { PartialType } from '@nestjs/mapped-types';
import { CreateTodoItemsJsonDto } from './create-todo-items-json.dto';

export class UpdateTodoItemsJsonDto extends PartialType(CreateTodoItemsJsonDto) {}
