import { Test, TestingModule } from '@nestjs/testing';
import { FilesFoldersController } from './files-folders.controller';
import { FilesFoldersService } from './files-folders.service';

describe('FilesFoldersController', () => {
  let controller: FilesFoldersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesFoldersController],
      providers: [FilesFoldersService],
    }).compile();

    controller = module.get<FilesFoldersController>(FilesFoldersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
