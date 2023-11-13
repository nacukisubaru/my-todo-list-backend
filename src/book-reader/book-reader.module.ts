import { Module } from '@nestjs/common';
import { BookReaderService } from './book-reader.service';
import { BookReaderController } from './book-reader.controller';
import { FilesModule } from 'src/files/files.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { BookReader } from './entities/book-reader.entity';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [BookReaderController],
  providers: [BookReaderService],
  imports: [
    SequelizeModule.forFeature([BookReader]),
    FilesModule,
    JwtModule,
    HttpModule
  ]
})
export class BookReaderModule {}
