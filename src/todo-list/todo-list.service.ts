import { Injectable } from '@nestjs/common';
import { CreateTodoListDto } from './dto/create-todo-list.dto';
import { UpdateTodoListDto } from './dto/update-todo-list.dto';
import { TodoList } from './entities/todo-list.entity';
import { InjectModel } from '@nestjs/sequelize';
import { SectionsTodoListService } from 'src/sections-todo-list/sections-todo-list.service';

@Injectable()
export class TodoListService {
  constructor(
    @InjectModel(TodoList) private todoListRepo: typeof TodoList,
    private sectionsTodoListService: SectionsTodoListService
  ) { }

  async getTodosWithSections(sectionId: string) {
    const todoList = [];
    let todoItems = [];

    const todosSections = await this.sectionsTodoListService.getListBySectionId(sectionId);
    todosSections.map(todoSection => {
      const todos = todoSection.todos;
      const sectionObj = {
        id: todoSection.id,
        name: todoSection.name,
        showTasks: todoSection.showTasks,
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
            description: todo.dataValues.description,
            sort: todo.dataValues.sort,
            type: 'task',
            showTasks: todo.dataValues.showTasks,
            editable: false,
            creatableLower: false,
            creatableUpper: false,
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
            description: todo.dataValues.description,
            sort: todo.dataValues.sort,
            type: 'task',
            showTasks: todo.dataValues.showTasks,
            editable: false,
            creatableLower: false,
            creatableUpper: false,
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
          if (todo.items.length) {
            recursiveBuildTodoList(todo.items);
          }
        }
      });
    }

    todoList.map((section) => {
      recursiveBuildTodoList(section.items);
    });

    return todoList;
  }

  create(createTodoListDto: CreateTodoListDto) {
    return 'This action adds a new todoList';
  }

  findAll() {
    return `This action returns all todoList`;
  }

  findOne(id: number) {
    return `This action returns a #${id} todoList`;
  }

  update(id: number, updateTodoListDto: UpdateTodoListDto) {
    return `This action updates a #${id} todoList`;
  }

  remove(id: number) {
    return `This action removes a #${id} todoList`;
  }
}
