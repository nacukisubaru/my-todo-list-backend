import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Files } from './entities/file.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports:[
    SequelizeModule.forFeature([Files]),
    JwtModule
  ],
})
export class FilesModule {}
