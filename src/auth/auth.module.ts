import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { SectionsListService } from 'src/sections-list/sections-list.service';
import { SectionsListModule } from 'src/sections-list/sections-list.module';
import { TodoItemsJsonModule } from 'src/todo-items-json/todo-items-json.module';

@Module({
    providers: [AuthService],
    controllers: [AuthController],
    imports: [
        forwardRef(() => UsersModule),
        JwtModule.register({
            secret: 'SECRET',
            signOptions: {
                expiresIn: '30d'
            }
        }),
        SectionsListModule,
        TodoItemsJsonModule
    ],
    exports: [
        AuthModule,
        JwtModule
    ]
})
export class AuthModule { }
