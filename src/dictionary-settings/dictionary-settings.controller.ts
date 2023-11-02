import { Controller, Get, UseGuards, Req, Post, Body } from '@nestjs/common';
import { DictionarySettingsService } from './dictionary-settings.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateDictionarySettingFromCodesDto } from './dto/create-dictionary-settings-from-codes.dto';
import { setActiveSettingDto } from './dto/set-active-setting.dto';

@Controller('dictionary-settings')
export class DictionarySettingsController {
  constructor(private readonly dictionarySettingsService: DictionarySettingsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/get-active-settings-by-user')
  getActiveSettingsByUser(@Req() request) {
    return this.dictionarySettingsService.getActiveSettings(request.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/get-settings-by-user')
  getAllSettings(@Req() request) {
    return this.dictionarySettingsService.getSettings(request.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/create-settings')
  createSettings(@Body() createDictionarySettingsFromCodesDto: CreateDictionarySettingFromCodesDto, @Req() request) {
    return this.dictionarySettingsService.createSettingsFromArrayCodes(createDictionarySettingsFromCodesDto, request.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/set-active-setting')
  setActiveSetting(@Body() setActiveSettingDto: setActiveSettingDto, @Req() request) {
    return this.dictionarySettingsService.setActiveSetting(setActiveSettingDto, request.user.id);
  }
}
