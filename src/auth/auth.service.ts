import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/users.model';
import { SectionsListService } from 'src/sections-list/sections-list.service';
import { TodoItemsJsonService } from 'src/todo-items-json/todo-items-json.service';
@Injectable()
export class AuthService {

    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
        private sectionService: SectionsListService,
        private todoItemsJsonService: TodoItemsJsonService
    ) { }

    async login(userDto: CreateUserDto) {
        const user = await this.validateUser(userDto);
        return this.genereateToken(user);
    }

    async registration(userDto: CreateUserDto) {
        const candidate = await this.userService.getUserByEmail(userDto.login);
        if (candidate) {
            throw new HttpException('Пользователь с таким логином существует', HttpStatus.BAD_REQUEST);
        }

        const hashPassword = await bcrypt.hash(userDto.password, 5);
        const user = await this.userService.createUser({ ...userDto, password: hashPassword });
        await this.sectionService.create({ id: bcrypt.genSaltSync(10) + Date.now(), name: 'Начало работы', sort: 0, showSections: true, parentId: null }, user.id);
        await this.todoItemsJsonService.createJsons(user.id);
        return this.genereateToken(user);
    }

    private async genereateToken(user: User) {
        const payload = { login: user.login, id: user.id };
        return {
            token: this.jwtService.sign(payload)
        }
    }

    private async validateUser(userDto: CreateUserDto) {
        const user = await this.userService.getUserByEmail(userDto.login);
        if (!user) {
            throw new UnauthorizedException({ message: 'Некорректный логин' })
        }
        const passwordEquals = await bcrypt.compare(userDto.password, user.password);
        if (user && passwordEquals) {
            return user;
        }

        throw new UnauthorizedException({ message: 'Некорректный пароль' })
    }

}
