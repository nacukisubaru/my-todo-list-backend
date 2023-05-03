import { Injectable } from '@nestjs/common';
import { CreateSectionsTodoListDto } from './dto/create-sections-todo-list.dto';
import { UpdateSectionsTodoListDto } from './dto/update-sections-todo-list.dto';
import { InjectModel } from '@nestjs/sequelize';
import { SectionsTodoList } from './entities/sections-todo-list.entity';

@Injectable()
export class SectionsTodoListService {
  constructor(@InjectModel(SectionsTodoList) private sectionsTodosRepo: typeof SectionsTodoList) { }

  async create(createSectionsTodoListDto: CreateSectionsTodoListDto) {
    return await this.sectionsTodosRepo.create({...createSectionsTodoListDto});
  }

  public async getListBySectionId(sectionId: string) {
    return await this.sectionsTodosRepo.findAll({where: {sectionId}, include:{all: true, nested: true}});
  }

  async updateSortPositions(sectionsList) {
    if (sectionsList.length) {
      const todosIds = sectionsList.map((todo) => {
        this.sectionsTodosRepo.update({sort: todo.sort}, {where: {id: todo.id}});
      });
    }
  }

  async update(updateSectionsTodoListDto: UpdateSectionsTodoListDto) {
    const {name, showTasks} = updateSectionsTodoListDto;
    return await this.sectionsTodosRepo.update({name, showTasks}, {where: {id: updateSectionsTodoListDto.id}});
  }

  findOne(id: number) {
    return `This action returns a #${id} sectionsTodoList`;
  }

  remove(id: number) {
    return `This action removes a #${id} sectionsTodoList`;
  }
}
