import { Module } from '@nestjs/common';
import { FilesFoldersService } from './files-folders.service';
import { FilesFoldersController } from './files-folders.controller';
import { FilesFolder } from './entities/files-folder.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { FilesModule } from 'src/files/files.module';

@Module({
  controllers: [FilesFoldersController],
  providers: [FilesFoldersService],
  imports:[
    SequelizeModule.forFeature([FilesFolder]),
    JwtModule,
    FilesModule
  ],
})

export class FilesFoldersModule {}
