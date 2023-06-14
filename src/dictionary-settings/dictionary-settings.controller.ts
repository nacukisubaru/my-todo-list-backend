import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { DictionarySettingsService } from './dictionary-settings.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('dictionary-settings')
export class DictionarySettingsController {
  constructor(private readonly dictionarySettingsService: DictionarySettingsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/get-settings-by-user')
  getSettingsByUser(@Req() request) {
    return this.dictionarySettingsService.getSettings(request.user.id);
  }
}
