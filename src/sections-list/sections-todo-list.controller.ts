import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { SectionsListService } from './sections-list.service';
import { CreateSectionsListDto } from './dto/create-sections-list.dto';
import { UpdateSectionsListDto } from './dto/update-sections-list.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('sections-list')
export class SectionsListController {
  constructor(private readonly sectionsListService: SectionsListService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  create(@Body() createSectionsListDto: CreateSectionsListDto, @Req() request) {
    return this.sectionsListService.create(createSectionsListDto, request.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/list')
  findAll(@Req() request) {
    return this.sectionsListService.findAll(request.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sectionsListService.findOne(+id);
  }

  @Post('/update')
  update(@Body() updateSectionsListDto: UpdateSectionsListDto) {
    return this.sectionsListService.update(updateSectionsListDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sectionsListService.remove(+id);
  }
}
