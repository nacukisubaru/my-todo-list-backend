import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DictionarySettings } from './entities/dictionary-setting.entity';

@Injectable()
export class DictionarySettingsService {

  constructor(
    @InjectModel(DictionarySettings) private dictionarySettingsRepo: typeof DictionarySettings,
  ) {}

  async setDefaultLanguage(userId: number, lang: string) {
    return await this.dictionarySettingsRepo.update({targetLanguage: lang}, {where: {userId}})
  }

  async createDefaultSetting(userId: number) {
    return await this.dictionarySettingsRepo.create({userId, sourceLanguage: 'ru' ,targetLanguage: 'en', isActive: true});
  }

  async getSettings(userId: number) {
    const settings = await this.dictionarySettingsRepo.findOne({where: {userId, isActive: true}});
    if (!settings) {
      await this.createDefaultSetting(userId);
      return await this.dictionarySettingsRepo.findOne({where: {userId, isActive: true}});
    }
    return settings;
  }
}
