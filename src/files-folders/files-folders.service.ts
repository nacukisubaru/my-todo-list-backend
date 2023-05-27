import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFilesFolderDto } from './dto/create-files-folder.dto';
import { UpdateFilesFolderDto } from './dto/update-files-folder.dto';
import { InjectModel } from '@nestjs/sequelize';
import { FilesFolder } from './entities/files-folder.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FilesFoldersService {
  
  constructor(
    @InjectModel(FilesFolder) private folderRepo: typeof FilesFolder
  ) {}

  async create(folderName: string, userId: number) {
    let filePath = path.resolve('./public/upload/' + folderName);
    if(!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, {recursive: true});
    } else {
      return new HttpException('Папка ' + folderName + ' уже существует', HttpStatus.BAD_REQUEST);
    }

    return await this.folderRepo.create({name: folderName, userId});
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
