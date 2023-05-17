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

  async create(createSectionsListDto: CreateSectionsListDto, userId: number) {
    return await this.sectionsRepo.create({ ...createSectionsListDto, userId });
  }

  async updateSortPositions(sectionsList) {
    if (sectionsList.length) {
      const requests = sectionsList.map((todo) => {
       return this.sectionsRepo.update({ sort: todo.sort }, { where: { id: todo.id } });
      });
      return await Promise.all(requests);
    }
  }

  private async getSections(userId: number) {
    const sectionList = [];
    const sectionItems = [];
    const sections = await this.sectionsRepo.findAll({where: {userId}});
    sections.map(section => {
      const sectionObj = {
        id: section.id,
        type: "section",
        parentId: null,
        name: section.name,
        showSections: section.showSections,
        sort: section.sort,
        items: []
      };

      if (section.dataValues.parentId) {
        sectionItems.push({
          id: section.dataValues.id,
          name: section.dataValues.name,
          parentId: section.dataValues.parentId,
          sort: section.dataValues.sort,
          showSections: section.dataValues.showSections,
          items: []
        });
      }

      if (!section.parentId) { 
        sectionList.push(sectionObj);
      }
    });

    const recursiveBuildTodoList = (sections) => {
      sections.map((section) => {
        sectionItems.map((sectionItem) => {
          if (section.id === sectionItem.parentId) {
            section.items.push(sectionItem);
          }
        });

        if (section.items.length) {
          recursiveBuildTodoList(section.items);
        }
      });
      sections.sort((a, b) => a.sort - b.sort);
      sections.map((section, index) => {
        section.index = index;
      });
    }

    recursiveBuildTodoList(sectionList);
    sectionList.sort((a, b) => a.sort - b.sort);
    sectionList.map((section, index) => {
      section.index = index;
    });
    return sectionList;
  }

  async findAll(userId: number) {
    return await this.getSections(userId);
  }

  findOne(id: number) {
    return `This action returns a #${id} sectionsList`;
  }

  async update(updateSectionsListDto: UpdateSectionsListDto) {
    return await this.sectionsRepo.update({...updateSectionsListDto}, {where: {id: updateSectionsListDto.id}});
  }

  remove(id: number) {
    return `This action removes a #${id} sectionsList`;
  }
}
