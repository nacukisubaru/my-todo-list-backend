import { PartialType } from '@nestjs/mapped-types';
import { CreateDictionarySettingDto } from './create-dictionary-setting.dto';

export class UpdateDictionarySettingDto extends PartialType(CreateDictionarySettingDto) {}
