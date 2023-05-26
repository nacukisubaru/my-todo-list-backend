import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post('/create-file-in-folder/')
  create(@Body() createFileDto: CreateFileDto, @UploadedFile() image, @Req() req) {
    console.log({image})
    return this.filesService.createInFolder(createFileDto, image, req.user.id);
  }

  @Get('/get-files-by-folder/:id')
  getListByFolder(@Param('id') id: string) {
    return this.filesService.getLisyByFolder(parseInt(id));
  }

  @Get()
  findAll() {
    return this.filesService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.filesService.update(+id, updateFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filesService.remove(+id);
  }
}
