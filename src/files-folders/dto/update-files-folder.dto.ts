import { PartialType } from '@nestjs/mapped-types';
import { CreateFilesFolderDto } from './create-files-folder.dto';

export class UpdateFilesFolderDto extends PartialType(CreateFilesFolderDto) {
    id: number;
}
