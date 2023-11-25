import { Test, TestingModule } from '@nestjs/testing';
import { BookReaderController } from './book-reader.controller';
import { BookReaderService } from './book-reader.service';

describe('BookReaderController', () => {
  let controller: BookReaderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookReaderController],
      providers: [BookReaderService],
    }).compile();

    controller = module.get<BookReaderController>(BookReaderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
