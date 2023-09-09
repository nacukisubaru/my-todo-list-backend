import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLingvoApiDto } from './dto/create-lingvo-api.dto';
import { UpdateLingvoApiDto } from './dto/update-lingvo-api.dto';
import { HttpService } from '@nestjs/axios';
import { response } from 'express';

@Injectable()
export class LingvoApiService {
  
  private lingvoApiKey = process.env.lingvoKey;
  private url = "https://developers.lingvolive.com";

  constructor(private readonly httpService: HttpService) {}

  async authorize() {
      const response: any = await this.httpService.axiosRef.post(
        this.url + '/api/v1/authenticate',
        {},
        {
          headers: {
            "Authorization": 'Basic ' + this.lingvoApiKey,
            "Content-Type": "application/json",
            "Content-Length": 0
          }
        }
      ).catch(function (error) {
        throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
      });

      return response.data;
  }

  async shortTranslateWord(word: string) {
    const token = await this.authorize();

      const response = await this.httpService.axiosRef.get(
        this.url + `/api/v1/Minicard?text=${word}&srcLang=1033&dstLang=1049`, 
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
        ).catch(function (error) {
          throw new HttpException(error.response.data, HttpStatus.BAD_REQUEST);
        });
        
        return await response.data;
  }

  create(createLingvoApiDto: CreateLingvoApiDto) {
    return 'This action adds a new lingvoApi';
  }

  findAll() {
    return `This action returns all lingvoApi`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lingvoApi`;
  }

  update(id: number, updateLingvoApiDto: UpdateLingvoApiDto) {
    return `This action updates a #${id} lingvoApi`;
  }

  remove(id: number) {
    return `This action removes a #${id} lingvoApi`;
  }
}
