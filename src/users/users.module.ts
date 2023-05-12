import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersService } from './users.service';
import { User } from './users.model';
import { AuthModule } from 'src/auth/auth.module';
@Module({
    controllers: [],
    providers: [UsersService],
    imports: [
        SequelizeModule.forFeature([User]),
        forwardRef(() => AuthModule)
    ],
    exports: [UsersService]
})
export class UsersModule { }
