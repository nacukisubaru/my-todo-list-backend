import { PartialType } from '@nestjs/mapped-types';
import { CreateLingvoApiDto } from './create-lingvo-api.dto';

export class UpdateLingvoApiDto extends PartialType(CreateLingvoApiDto) {}
