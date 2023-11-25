import { Test, TestingModule } from '@nestjs/testing';
import { BookReaderService } from './book-reader.service';

describe('BookReaderService', () => {
  let service: BookReaderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookReaderService],
    }).compile();

    service = module.get<BookReaderService>(BookReaderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
