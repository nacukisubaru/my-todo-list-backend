import { PartialType } from '@nestjs/mapped-types';
import { CreateSectionsListDto } from './create-sections-list.dto';

export class UpdateSectionsListDto extends PartialType(CreateSectionsListDto) {}
