import { Module } from '@nestjs/common';
import { FilesFoldersService } from './files-folders.service';
import { FilesFoldersController } from './files-folders.controller';
import { FilesFolder } from './entities/files-folder.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [FilesFoldersController],
  providers: [FilesFoldersService],
  imports:[
    SequelizeModule.forFeature([FilesFolder]),
    JwtModule
  ],
})
export class FilesFoldersModule {}
