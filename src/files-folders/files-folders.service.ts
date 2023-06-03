import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFilesFolderDto } from './dto/create-files-folder.dto';
import { UpdateFilesFolderDto } from './dto/update-files-folder.dto';
import { InjectModel } from '@nestjs/sequelize';
import { FilesFolder } from './entities/files-folder.entity';
import * as fs from 'fs';
import * as path from 'path';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class FilesFoldersService {
  
  constructor(
    @InjectModel(FilesFolder) private folderRepo: typeof FilesFolder,
    private filesService: FilesService
  ) {}

  async create(folderName: string, userId: number) {
    const rootPath = `/upload/${userId}/root`;
    let filePath = path.resolve(`./public${rootPath}/` + folderName);
    if(!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, {recursive: true});
    } else {
      return new HttpException('Папка ' + folderName + ' уже существует', HttpStatus.BAD_REQUEST);
    }

    return await this.folderRepo.create({name: folderName, userId});
  }

  async getListByUser(userId: number) {
    const rootPath = `/upload/${userId}/root`;
    let filePath = `./public${rootPath}`;
    if(!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, {recursive: true});
      const foundRootFolder = await this.folderRepo.findOne({where: {name: 'root', userId}});
      if (foundRootFolder) {
        await this.folderRepo.create({name: 'root', userId});
      }
    }
    
    return await this.folderRepo.findAll({where: {userId}});
  }

  findOne(id: number) {
    return `This action returns a #${id} filesFolder`;
  }

  update(id: number, updateFilesFolderDto: UpdateFilesFolderDto) {
    return `This action updates a #${id} filesFolder`;
  }

  async remove(id: number, userId: number) {
    const rootPath = `/upload/${userId}/root`;
    const removeFolder = await this.folderRepo.findOne({where: {userId, id}});

    if (!removeFolder) {
      return new HttpException('Папки не существует!', HttpStatus.BAD_REQUEST);
    }
    
    if (removeFolder.name === 'root') {
      return new HttpException('Папка является корневой!', HttpStatus.BAD_REQUEST);
    }

    let filePath = path.resolve(`./public${rootPath}/` + removeFolder.name);
    fs.rmdirSync(filePath, {recursive: true});

    await this.filesService.removeByFolderId(id);
    return await this.folderRepo.destroy({where: {id}});
  }
}
