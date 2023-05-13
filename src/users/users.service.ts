import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private userRepository: typeof User) {}
 
    async createUser(dto: CreateUserDto) {
        const userExist = await this.getUserByEmail(dto.login)
        if(userExist) {
            throw new HttpException(`Пользователь c логином ${userExist.login} уже существует !`,HttpStatus.BAD_REQUEST);
        }
        const user = await this.userRepository.create(dto);
        return user;
    }

    async getAllUsers() {
        return await this.userRepository.findAll({include: {all: true}});
    }

    async getUserByEmail(login: string) {
       return await this.userRepository.findOne({where: {login}, include: {all: true}});
    }
}
