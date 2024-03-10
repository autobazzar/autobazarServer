import { Injectable } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DataSource } from 'typeorm';
import { hash, compare } from 'bcrypt';
import { SALT_ROUNDS } from "config";
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private dataSource: DataSource) { }

  async create(user: CreateUserDto) {
    try {

      const newUser = this.dataSource.manager.create(User, user);

      await this.dataSource.manager.save(newUser);

      return true;
    } catch (e) {
   
      throw e;
    }
  }

  async loginUser(user: LoginUserDto) {
    const { password, email } = user;
    const findUser = await this.dataSource.manager.findOne(User, {
      where: {
        email,
      }
    })

    if (findUser && await compare(password, findUser.password)) {
      const { password, ...rest } = findUser;
      return rest;
    }
    return null;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
