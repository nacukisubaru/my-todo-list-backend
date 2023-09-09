import { Test, TestingModule } from '@nestjs/testing';
import { LingvoApiController } from './lingvo-api.controller';
import { LingvoApiService } from './lingvo-api.service';

describe('LingvoApiController', () => {
  let controller: LingvoApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LingvoApiController],
      providers: [LingvoApiService],
    }).compile();

    controller = module.get<LingvoApiController>(LingvoApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
