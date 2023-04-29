import { Injectable } from '@nestjs/common';
import { CreateSectionsListDto } from './dto/create-sections-list.dto';
import { UpdateSectionsListDto } from './dto/update-sections-list.dto';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class SectionsListService {
  create(createSectionsListDto: CreateSectionsListDto) {
    return 'This action adds a new sectionsList';
  }

  findAll() {
    return `This action returns all sectionsList`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sectionsList`;
  }

  update(id: number, updateSectionsListDto: UpdateSectionsListDto) {
    return `This action updates a #${id} sectionsList`;
  }

  remove(id: number) {
    return `This action removes a #${id} sectionsList`;
  }
}
