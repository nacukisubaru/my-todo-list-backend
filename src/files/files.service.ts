import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { Files } from './entities/file.entity';
import { InjectModel } from '@nestjs/sequelize';
import * as fs from 'fs';
import * as path from 'path';
import * as uuid from 'uuid';

interface IFile {
  fieldname: string,
  originalname: string,
  encoding: string,
  mimetype: string,
  buffer: BinaryData,
  size: number
}

@Injectable()
export class FilesService {

  constructor(
    @InjectModel(Files) private filesRepo: typeof Files
  ) {}

  async createInFolder(createFileDto: CreateFileDto, file: IFile, userId: any) {
    let {folderId, folderName} = createFileDto;
    if (folderName === 'root') {
      folderName = '';
    }
    const originalName = path.parse(file.originalname);
    if (originalName.ext !== '.jpg' && originalName.ext !== '.png' &&
      originalName.ext !== '.mp4' && 
      originalName.ext !== '.webm' && originalName.ext !== '.jpeg') {
        throw new HttpException(`Данный формат ${originalName.ext} не подходит для загрузки`, HttpStatus.BAD_REQUEST);
    }

    const fileResult = this.createFile(file, folderName, originalName.ext, userId);
    const {filePathServer, parsePath} = fileResult;

    return await this.filesRepo.create({
      folderId, 
      userId,
      path: filePathServer, 
      name: parsePath.name + parsePath.ext, 
      originalName: originalName.name + parsePath.ext
    })
  }

  createFile(file: any, folder: string = '', extension: string, userId: any) {
    try {
        const fileName = uuid.v4() + extension;
        const rootPath = `/upload/${userId}/root/`;
        let filePath = path.resolve(`./public${rootPath}`);
        if (folder) {
          filePath = filePath + '/' + folder;
        }
        if(!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath, {recursive: true});
        }
        const link = path.join(filePath, fileName);
        fs.writeFileSync(link, file.buffer);

        const parsePath = path.parse(link);
        let filePathServer = process.env.API_URL + rootPath + parsePath.name + parsePath.ext;
        if (folder) {
          filePathServer = process.env.API_URL + rootPath + folder + '/' + parsePath.name + parsePath.ext;
        }
        return {
          filePathServer,
          parsePath
        };
    } catch (e) {
      console.log({e})
        throw new HttpException('Произошла ошибка при записи файла', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

  findAll() {
    return `This action returns all files`;
  }

  async getLisyByFolder(folderId: number) {
    return await this.filesRepo.findAll({where: {folderId}})
  }

  update(id: number, updateFileDto: UpdateFileDto) {
    return `This action updates a #${id} file`;
  }

  async remove(id: number, userId: number) {
    const fileToRemove = await this.filesRepo.findOne({include:{all:true}, where: {userId, id}});
    const rootPath = `/upload/${userId}/root`;
    if (!fileToRemove) {
      new HttpException('Файла не существует!', HttpStatus.BAD_REQUEST);
    }

    let filePath = '';

    if (fileToRemove.folder.name === 'root') {
      filePath = path.resolve(`./public${rootPath}/` + fileToRemove.name);
    } else {
      filePath = path.resolve(`./public${rootPath}` + fileToRemove.folder.name + '/' + fileToRemove.name);
    }

    fs.unlinkSync(filePath);
    return await this.filesRepo.destroy({where: {id}});
  }

  async removeByFolderId(folderId: number) {
    return await this.filesRepo.destroy({where: {folderId}});
  }

}
