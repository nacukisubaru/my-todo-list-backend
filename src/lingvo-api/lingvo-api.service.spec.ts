import { Test, TestingModule } from '@nestjs/testing';
import { LingvoApiService } from './lingvo-api.service';

describe('LingvoApiService', () => {
  let service: LingvoApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LingvoApiService],
    }).compile();

    service = module.get<LingvoApiService>(LingvoApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
