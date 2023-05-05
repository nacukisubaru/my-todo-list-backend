import { Injectable } from '@nestjs/common';
import { CreateSectionsListDto } from './dto/create-sections-list.dto';
import { UpdateSectionsListDto } from './dto/update-sections-list.dto';
import { InjectModel } from '@nestjs/sequelize';
import { SectionsList } from './entities/sections-list.entity';

@Injectable()
export class SectionsListService {
  constructor(
    @InjectModel(SectionsList) private sectionsRepo: typeof SectionsList
  ) { }

  create(createSectionsListDto: CreateSectionsListDto) {
    return 'This action adds a new sectionsList';
  }

  async findAll() {
    return await this.sectionsRepo.findAll();
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
