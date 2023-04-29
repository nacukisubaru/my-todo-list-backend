import { Module } from '@nestjs/common';
import { TodoListModule } from './todo-list/todo-list.module';
import { SectionsListModule } from './sections-list/sections-list.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TodoList } from './todo-list/entities/todo-list.entity';
import { SectionsList } from './sections-list/entities/sections-list.entity';
import { ConfigModule } from '@nestjs/config';
import { SectionsTodoListModule } from './sections-todo-list/sections-todo-list.module';
import { SectionsTodoList } from './sections-todo-list/entities/sections-todo-list.entity';

@Module({
  imports: [
   TodoListModule,
   SectionsListModule,
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
        SectionsTodoList
      ],
      autoLoadModels: true
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'static'),
    }),
    SectionsTodoListModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
