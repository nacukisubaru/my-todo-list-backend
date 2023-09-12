import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DictionarySettings } from './entities/dictionary-setting.entity';
import { YandexCloudService } from 'src/yandex-cloud/yandex-cloud.service';
import { LangCodesISO } from 'src/helpers/languageHelper';
import { CreateDictionarySettingDto } from './dto/create-dictionary-setting.dto';

@Injectable()
export class DictionarySettingsService {

  constructor(
    @InjectModel(DictionarySettings) private dictionarySettingsRepo: typeof DictionarySettings
  ) {}

  async setDefaultLanguage(userId: number, lang: string) {
    return await this.dictionarySettingsRepo.update({targetLanguage: lang}, {where: {userId}})
  }

  async createDefaultSetting(createSettingsDto: CreateDictionarySettingDto, userId: number) {
    const sourceISO = LangCodesISO[createSettingsDto.sourceLanguage];
    const targetISO = LangCodesISO[createSettingsDto.targetLanguage];
    return await this.dictionarySettingsRepo.create({...createSettingsDto, sourceISO, targetISO, userId, isActive: true});
  }

  async getActiveSettings(userId: number) {
    const settings = await this.dictionarySettingsRepo.findOne({where: {userId, isActive: true}});
    if (!settings) {
      await this.createDefaultSetting({sourceLanguage: 'ru', targetLanguage: 'en'}, userId);
      return await this.dictionarySettingsRepo.findOne({where: {userId, isActive: true}});
    }
    return settings;
  }

  async getSettings(userId: number) {
    const settings = await this.dictionarySettingsRepo.findAll({where: {userId}});
    
    const langsForStudy = settings.map((setting) => {
      return {code: setting.sourceLanguage, isoName: setting.sourceISO};
    });

    const studyLangs = settings.map((setting) => {
      return {code: setting.targetLanguage, isoName: setting.targetISO};
    });

    return {settings, langsForStudy, studyLangs};
  }
}
