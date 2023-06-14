import { Module } from '@nestjs/common';
import { DictionarySettingsService } from './dictionary-settings.service';
import { DictionarySettingsController } from './dictionary-settings.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { DictionarySettings } from './entities/dictionary-setting.entity';

@Module({
  controllers: [DictionarySettingsController],
  providers: [DictionarySettingsService],
  imports: [
    SequelizeModule.forFeature([DictionarySettings]),
    JwtModule
  ],
  exports: [
    DictionarySettingsService
  ]
})
export class DictionarySettingsModule {}
