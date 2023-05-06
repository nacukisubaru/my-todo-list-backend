import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SectionsListService } from './sections-list.service';
import { CreateSectionsListDto } from './dto/create-sections-list.dto';
import { UpdateSectionsListDto } from './dto/update-sections-list.dto';

@Controller('sections-list')
export class SectionsListController {
  constructor(private readonly sectionsListService: SectionsListService) {}

  @Post('/create')
  create(@Body() createSectionsListDto: CreateSectionsListDto) {
    return this.sectionsListService.create(createSectionsListDto);
  }

  @Get('/list')
  findAll() {
    return this.sectionsListService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sectionsListService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSectionsListDto: UpdateSectionsListDto) {
    return this.sectionsListService.update(+id, updateSectionsListDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sectionsListService.remove(+id);
  }
}
