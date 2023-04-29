import { Injectable } from '@nestjs/common';
import { CreateSectionsTodoListDto } from './dto/create-sections-todo-list.dto';
import { UpdateSectionsTodoListDto } from './dto/update-sections-todo-list.dto';
import { InjectModel } from '@nestjs/sequelize';
import { SectionsTodoList } from './entities/sections-todo-list.entity';

@Injectable()
export class SectionsTodoListService {
  constructor(@InjectModel(SectionsTodoList) private sectionsTodosRepo: typeof SectionsTodoList) { }

  create(createSectionsTodoListDto: CreateSectionsTodoListDto) {
    return 'This action adds a new sectionsTodoList';
  }

  public async getListBySectionId(sectionId: string) {
    return await this.sectionsTodosRepo.findAll({where: {sectionId}, include:{all: true, nested: true}});
  }

  findOne(id: number) {
    return `This action returns a #${id} sectionsTodoList`;
  }

  update(id: number, updateSectionsTodoListDto: UpdateSectionsTodoListDto) {
    return `This action updates a #${id} sectionsTodoList`;
  }

  remove(id: number) {
    return `This action removes a #${id} sectionsTodoList`;
  }
}
