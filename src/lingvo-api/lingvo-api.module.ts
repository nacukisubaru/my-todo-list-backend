import { Module } from '@nestjs/common';
import { LingvoApiService } from './lingvo-api.service';
import { LingvoApiController } from './lingvo-api.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [LingvoApiController],
  providers: [LingvoApiService],
  imports: [HttpModule],
})
export class LingvoApiModule {}
