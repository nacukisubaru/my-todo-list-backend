import { PartialType } from '@nestjs/mapped-types';
import { CreateDictionaryDto } from './create-dictionary.dto';
import { studyStageType } from '../dictionary.service';

export class UpdateDictionaryDto extends PartialType(CreateDictionaryDto) {
    studyStage: studyStageType;
}
