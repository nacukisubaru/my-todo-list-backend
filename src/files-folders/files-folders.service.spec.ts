import { Test, TestingModule } from '@nestjs/testing';
import { FilesFoldersService } from './files-folders.service';

describe('FilesFoldersService', () => {
  let service: FilesFoldersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilesFoldersService],
    }).compile();

    service = module.get<FilesFoldersService>(FilesFoldersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
