import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TodoListService } from './todo-list.service';
import { CreateTodoListDto } from './dto/create-todo-list.dto';
import { UpdateTodoListDto } from './dto/update-todo-list.dto';

@Controller('todo-list')
export class TodoListController {
  constructor(private readonly todoListService: TodoListService) { }

  @Post()
  create(@Body() createTodoListDto: CreateTodoListDto) {
    return this.todoListService.create(createTodoListDto);
  }

  @Get('/by-section/:id')
  getBySectionAll(@Param('id') id: string) {
    return [
      {
        id: 'd41d8cd98f00b204e9800998ecf8427e',
        name: "section 1",
        description: 'test test',
        type: "section",
        showTasks: true,
        editable: false,
        creatable: false,
        items: [
          {
            id: '0e4189c5c61e752b472772fef5848817',
            parentId: 'd41d8cd98f00b204e9800998ecf8427e',
            name: 'todo 1',
            description: 'test test',
            type: 'task',
            showTasks: true,
            editable: false,
            creatableLower: false,
            creatableUpper: false,
            items: [
              {
                id: '0f79c51e8d06d410ce645cca8a405346',
                parentId: '0e4189c5c61e752b472772fef5848817',
                name: 'todo 2',
                description: 'test test',
                type: 'task',
                showTasks: true,
                editable: false,
                creatableLower: false,
                creatableUpper: false,
                items: []
              }
            ]
          }
        ],
      },
      {
        id: 'f038b29c46375dd9c99b0e267d37a930',
        name: "section 2",
        description: 'test test',
        type: "section",
        showTasks: true,
        editable: false,
        creatable: false,
        items: [
          {
            id: '6eaff33740fa0116c480adfce776f146',
            parentId: 'f038b29c46375dd9c99b0e267d37a930',
            name: 'todo 3',
            description: 'test test',
            type: 'task',
            showTasks: false,
            editable: false,
            creatableLower: false,
            creatableUpper: false,
            items: [
              {
                id: 'e9d8b713de6724084ea7629a77a99d3b',
                parentId: '6eaff33740fa0116c480adfce776f146',
                name: 'todo 4',
                description: 'test test',
                type: 'task',
                showTasks: false,
                editable: false,
                creatableLower: false,
                creatableUpper: false,
                items: [
                  {
                    id: 'd9f2e28c16cb8a784d972695a93aaac3',
                    parentId: 'e9d8b713de6724084ea7629a77a99d3b',
                    name: 'todo 5',
                    description: 'test test',
                    type: 'task',
                    showTasks: false,
                    editable: false,
                    creatableLower: false,
                    creatableUpper: false,
                    items: []
                  }
                ]
              }
            ]
          }
        ]
      }
    ];

    //return this.todoListService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todoListService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTodoListDto: UpdateTodoListDto) {
    return this.todoListService.update(+id, updateTodoListDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todoListService.remove(+id);
  }
}
