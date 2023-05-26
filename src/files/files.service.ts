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

  async createInFolder(createFileDto: CreateFileDto, file: IFile, userId: number) {
    const {folderId, folderName} = createFileDto;
    const fileResult = this.createFile(file, folderName);
    const {filePathServer, parsePath} = fileResult;

    const originalName = path.parse(file.originalname);

    return await this.filesRepo.create({
      folderId, 
      userId,
      path: filePathServer, 
      name: originalName.name + parsePath.ext
    })
  }

  createFile(file: any, folder: string = '') {
    console.log({file})
    try {
        const fileName = uuid.v4() + '.jpg';
        const filePath = path.resolve(__dirname, '..', 'static', folder);
        if(!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath, {recursive: true});
        }
        const link = path.join(filePath, fileName);
        fs.writeFileSync(link, file.buffer);

        const parsePath = path.parse(link);
        const filePathServer = process.env.API_URL + '/' + folder +'/'+parsePath.name + parsePath.ext;
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

  remove(id: number) {
    return `This action removes a #${id} file`;
  }
}
