import { Injectable } from '@nestjs/common';
import { CreateTodoListDto } from './dto/create-todo-list.dto';
import { UpdateTodoListDto } from './dto/update-todo-list.dto';
import { TodoList } from './entities/todo-list.entity';
import { InjectModel } from '@nestjs/sequelize';
import { SectionsTodoListService } from 'src/sections-todo-list/sections-todo-list.service';
import { TodoItemsJsonService } from 'src/todo-items-json/todo-items-json.service';
import { SectionsListService } from 'src/sections-list/sections-list.service';

@Injectable()
export class TodoListService {
  constructor(
    @InjectModel(TodoList) private todoListRepo: typeof TodoList,
    private sectionsTodoListService: SectionsTodoListService,
    private todoItemsJsonService: TodoItemsJsonService,
    private sectionsService: SectionsListService
  ) { }

  async getTodosWithSections(sectionId: string) {
    const todoList = [];
    let todoItems = [];

    const todosSections = await this.sectionsTodoListService.getListBySectionId(sectionId);
    todosSections.map(todoSection => {
      const todos = todoSection.todos;
      const sectionObj = {
        id: todoSection.id,
        sectionId: todoSection.id,
        name: todoSection.name,
        showTasks: todoSection.showTasks,
        sort: todoSection.sort,
        type: 'section',
        editable: false,
        creatable: false,
        items: []
      };

      todos.map((todo) => {
        if (!todo.dataValues.parentId && todo.dataValues.sectionId === todoSection.id) {
          sectionObj.items.push({
            id: todo.dataValues.id,
            name: todo.dataValues.name,
            parentId: todo.dataValues.sectionId,
            sectionId: todo.dataValues.sectionId,
            description: todo.dataValues.description,
            sort: todo.dataValues.sort,
            type: 'task',
            showTasks: todo.dataValues.showTasks,
            editable: false,
            creatable: false,
            creatableLower: false,
            creatableUpper: false,
            isComplete: todo.dataValues.isComplete,
            items: []
          });
        }
      });

      todos.map((todo) => {
        if (todo.dataValues.parentId) {
          todoItems.push({
            id: todo.dataValues.id,
            name: todo.dataValues.name,
            parentId: todo.dataValues.parentId,
            sectionId: todo.dataValues.sectionId,
            description: todo.dataValues.description,
            sort: todo.dataValues.sort,
            type: 'task',
            showTasks: todo.dataValues.showTasks,
            editable: false,
            creatable: false,
            creatableLower: false,
            creatableUpper: false,
            isComplete: todo.dataValues.isComplete,
            items: []
          });
        }
      });

      todoList.push(sectionObj);
    });

    const recursiveBuildTodoList = (todos) => {
      todos.map((todo) => {
        if (todo) {
          todoItems.map((todoItem) => {
            if (todo.id === todoItem.parentId) {
              todo.items.push(todoItem);
            }
          });
          todo.items.sort((a, b) => a.sort - b.sort);
          if (todo.items.length) {
            recursiveBuildTodoList(todo.items);
          }
        }
      });
    }

    todoList.map((section) => {
      recursiveBuildTodoList(section.items);
      section.items.sort((a, b) => a.sort - b.sort);
    });

    todoList.sort((a, b) => a.sort - b.sort);

    return todoList;
  }

  async create(createTodoListDto: CreateTodoListDto) {
    return await this.todoListRepo.create({ ...createTodoListDto });
  }


  async updatePositions(userId: number) {
    const todoItemsJson = await this.todoItemsJsonService.findOneByCodeAndUser('items', userId);
    const todoSectionsJson = await this.todoItemsJsonService.findOneByCodeAndUser('todo-sections', userId);
    const sectionsJson = await this.todoItemsJsonService.findOneByCodeAndUser('sections', userId);

    const updatePositions = async (id: any, jsonData: any, type?: any) => {
      if (jsonData.length) {
        await this.updateSortPositions(jsonData, type);
        await this.todoItemsJsonService.remove(id);
      }
    }

    if (todoItemsJson) {
      await updatePositions(todoItemsJson.id, todoItemsJson.jsonData);
    }
    if (todoSectionsJson) {
      await updatePositions(todoSectionsJson.id, todoSectionsJson.jsonData, "todo-sections");
    }
    if (sectionsJson) {
      await updatePositions(sectionsJson.id, sectionsJson.jsonData, "sections");
    }
  }

  async updateSortPositions(todoList, type?: any) {
    if (todoList.length) {
      if (type === "todo-sections") {
        await this.sectionsTodoListService.updateSortPositions(todoList);
      } else if (type === "sections") {
        await this.sectionsService.updateSortPositions(todoList);
      } else {
        todoList.map((todo) => {
          const {sort, isComplete} = todo;
          this.todoListRepo.update({sort, isComplete}, {where: {id: todo.id}});
          return todo.id;
        });
        // await this.todoListRepo.destroy({ where: { id: todosIds } });
        // await this.todoListRepo.bulkCreate(todoList);

      }
    }
  }

  async update(updateTodoListDto: UpdateTodoListDto) {
    const {name, description, showTasks, isComplete} = updateTodoListDto;
    return await this.todoListRepo.update({name, description, showTasks, isComplete}, {where: {id: updateTodoListDto.id}});
  }

  findAll() {
    return `This action returns all todoList`;
  }

  async findOne(id: string) {
    return await this.todoListRepo.findOne({where: {id}}); 
  }

  async remove(ids: string[], userId: number) {
    const itemsJson: any = await this.todoItemsJsonService.findOneByCodeAndUser('items', userId);
      const data: any[] = itemsJson.jsonData;
      const newItems: any = data.filter((item) => {
        if (!ids.includes(item.id)) {
          return item;
        }
      });

      await this.todoItemsJsonService.addItemsJson({jsonData: newItems}, userId);
      return await this.todoListRepo.destroy({ where: { id: ids } });
  }
}
