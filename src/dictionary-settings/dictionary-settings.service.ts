import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DictionarySettings } from './entities/dictionary-setting.entity';
import { LangCodesISO } from 'src/helpers/languageHelper';
import { CreateDictionarySettingDto } from './dto/create-dictionary-setting.dto';
import { CreateDictionarySettingFromCodesDto } from './dto/create-dictionary-settings-from-codes.dto';

@Injectable()
export class DictionarySettingsService {

  constructor(
    @InjectModel(DictionarySettings) private dictionarySettingsRepo: typeof DictionarySettings
  ) { }

  async setDefaultLanguage(userId: number, lang: string) {
    return await this.dictionarySettingsRepo.update({ targetLanguage: lang }, { where: { userId } })
  }

  async createDefaultSetting(createSettingsDto: CreateDictionarySettingDto, userId: number) {
    const sourceISO = LangCodesISO[createSettingsDto.sourceLanguage];
    const targetISO = LangCodesISO[createSettingsDto.targetLanguage];
    return await this.dictionarySettingsRepo.create({ ...createSettingsDto, sourceISO, targetISO, userId, isActive: true });
  }

  async getActiveSettings(userId: number) {
    const settings = await this.dictionarySettingsRepo.findOne({ where: { userId, isActive: true } });
    if (!settings) {
      await this.createDefaultSetting({ sourceLanguage: 'ru', targetLanguage: 'en' }, userId);
      return await this.dictionarySettingsRepo.findOne({ where: { userId, isActive: true } });
    }
    return settings;
  }

  async getSettings(userId: number) {
    const settings = await this.dictionarySettingsRepo.findAll({ where: { userId } });
    let langsForStudy = [];
    let studyLangs = [];

    settings.map((setting) => {
      if (!langsForStudy.includes(setting.sourceLanguage)) {
        langsForStudy.push(setting.sourceLanguage);
      }

      if (!studyLangs.includes(setting.targetLanguage)) {
        studyLangs.push(setting.targetLanguage);
      }
    });

    langsForStudy = langsForStudy.map((lang) => {
      return { code: lang, isoName: LangCodesISO[lang] };
    });

    studyLangs = studyLangs.map((lang) => {
      return { code: lang, isoName: LangCodesISO[lang] };
    });

    return { settings, langsForStudy, studyLangs };
  }

  async createSettingsFromArrayCodes(createDictionarySettingsFromCodesDto: CreateDictionarySettingFromCodesDto, userId: number) {
    let sourceCodesList = createDictionarySettingsFromCodesDto.sourceLangCodes;
    let targetCodesList = createDictionarySettingsFromCodesDto.targetLangCodes;

    const settings = await this.getSettings(userId);
    const codesList = [];

    if (targetCodesList.length && !sourceCodesList.length) {
      sourceCodesList = settings.langsForStudy.map(lang => lang.code);
    }

    if (sourceCodesList.length && !targetCodesList.length) {
      targetCodesList = settings.studyLangs.map(lang => lang.code);
    }

    targetCodesList.map((targetCode) => {
      sourceCodesList.map(sourceCode => {
        const sourceISO = LangCodesISO[sourceCode];
        const targetISO = LangCodesISO[targetCode];
        const codeObj = { sourceLanguage: sourceCode, targetLanguage: targetCode, sourceISO, targetISO, isActive: false, userId };
        let accessPush = true;
        settings.settings.map((setting) => {
          if (setting.sourceLanguage === codeObj.sourceLanguage && setting.targetLanguage === codeObj.targetLanguage) {
            accessPush = false;
          }
        })
        if (accessPush) {
          codesList.push(codeObj);
        }

      });
    });

    await this.dictionarySettingsRepo.bulkCreate(codesList);
    return codesList;
  }

  async setActiveSetting(id: number, userId: number) {
    const setting = await this.dictionarySettingsRepo.findOne({ where: { id } });
    if (!setting) {
      throw new HttpException({
        message: `Настройка не найдена по id${id}`,
        errorCode: 'settingNotFound',
        statusCode: HttpStatus.NOT_FOUND
      }, HttpStatus.NOT_FOUND);
    }

    const activeSetting = await this.dictionarySettingsRepo.findOne({ where: { isActive: true, userId } });
    if (activeSetting) {
      await this.dictionarySettingsRepo.update({ isActive: false }, { where: { id: activeSetting.id } });
    }
    
    return await this.dictionarySettingsRepo.update({ isActive: true }, { where: { id } });
  }
}
