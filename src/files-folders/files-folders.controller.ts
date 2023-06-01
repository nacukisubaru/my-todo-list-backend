import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { FilesFoldersService } from './files-folders.service';
import { CreateFilesFolderDto } from './dto/create-files-folder.dto';
import { UpdateFilesFolderDto } from './dto/update-files-folder.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('files-folders')
export class FilesFoldersController {
  constructor(private readonly filesFoldersService: FilesFoldersService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  create(@Body() createFilesFolderDto: CreateFilesFolderDto, @Req() request) {
    return this.filesFoldersService.create(createFilesFolderDto.name, request.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-list-by-user')
  getListByUser(@Req() request) {
    return this.filesFoldersService.getListByUser(request.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filesFoldersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFilesFolderDto: UpdateFilesFolderDto) {
    return this.filesFoldersService.update(+id, updateFilesFolderDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/remove')
  remove(@Body() deleteDto: UpdateFilesFolderDto, @Req() request) {
    return this.filesFoldersService.remove(deleteDto.id, deleteDto.name, request.user.id);
  }
}
