import { Module } from '@nestjs/common';
import { TodoListModule } from './todo-list/todo-list.module';
import { SectionsListModule } from './sections-list/sections-list.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { TodoList } from './todo-list/entities/todo-list.entity';
import { SectionsList } from './sections-list/entities/sections-list.entity';
import { ConfigModule } from '@nestjs/config';
import { SectionsTodoListModule } from './sections-todo-list/sections-todo-list.module';
import { SectionsTodoList } from './sections-todo-list/entities/sections-todo-list.entity';
import { TodoItemsJsonModule } from './todo-items-json/todo-items-json.module';
import { TodoItemsJson } from './todo-items-json/entities/todo-items-json.entity';
import { User } from './users/users.model';
import { UsersModule } from './users/users.module';
import { FilesModule } from './files/files.module';
import { FilesFoldersModule } from './files-folders/files-folders.module';
import { Files } from './files/entities/file.entity';
import { FilesFolder } from './files-folders/entities/files-folder.entity';
import { DictionaryModule } from './dictionary/dictionary.module';

@Module({
  imports: [
   TodoListModule,
   SectionsListModule,
   UsersModule,
   ConfigModule.forRoot({
    envFilePath: `.${process.env.NODE_ENV}.env`
  }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [
        TodoList,
        SectionsList,
        SectionsTodoList,
        TodoItemsJson,
        User,
        Files,
        FilesFolder
      ],
      autoLoadModels: true
    }),
    ServeStaticModule.forRoot(
      (() => {
          const publicDir = resolve('./public/upload/');
          const servePath = '/upload';

          return {
              rootPath: publicDir,
              // serveRoot - if you want to see files on another controller,
              // e.g.: http://localhost:8088/files/1.png
              serveRoot: servePath,
              exclude: ['/api*'],
          };
      })()
  ),
    SectionsTodoListModule,
    TodoItemsJsonModule,
    FilesModule,
    FilesFoldersModule,
    DictionaryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
