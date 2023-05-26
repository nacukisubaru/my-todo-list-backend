import { Injectable } from '@nestjs/common';
import { CreateFilesFolderDto } from './dto/create-files-folder.dto';
import { UpdateFilesFolderDto } from './dto/update-files-folder.dto';
import { InjectModel } from '@nestjs/sequelize';
import { FilesFolder } from './entities/files-folder.entity';

@Injectable()
export class FilesFoldersService {
  
  constructor(
    @InjectModel(FilesFolder) private folderRepo: typeof FilesFolder
  ) {}

  create(createFilesFolderDto: CreateFilesFolderDto) {
    return 'This action adds a new filesFolder';
  }

  async getListByUser(userId: number) {
    return await this.folderRepo.findAll({where: {userId}});
  }

  findOne(id: number) {
    return `This action returns a #${id} filesFolder`;
  }

  update(id: number, updateFilesFolderDto: UpdateFilesFolderDto) {
    return `This action updates a #${id} filesFolder`;
  }

  remove(id: number) {
    return `This action removes a #${id} filesFolder`;
  }
}
