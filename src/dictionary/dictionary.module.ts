import { Module } from '@nestjs/common';
import { DictionaryService } from './dictionary.service';
import { DictionaryController } from './dictionary.controller';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { Dictionary } from './entities/dictionary.entity';

@Module({
  controllers: [DictionaryController],
  providers: [DictionaryService],
  imports: [
    SequelizeModule.forFeature([Dictionary]),
    JwtModule
  ],
  exports: [
    DictionaryService
  ]
})
export class DictionaryModule {}
