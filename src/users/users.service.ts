import { Injectable } from '@nestjs/common';
import { CreateUserDto, LoginUserDto, LoginWithGoogleDto } from './dto/create-user.dto';
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

  async loginUser(user: LoginUserDto | LoginWithGoogleDto, fromGoogle = false) {
    //@ts-ignore
    const { password, email } = user;
    const findUser = await this.dataSource.manager.findOne(User, {
      where: {
        email,
      }
    })

    if (findUser && (fromGoogle || await compare(password, findUser.password))) {
      return this.getProfile(findUser);
    }
    return null;
  }

  async getProfile(findUser: User) {
    const { password, ...rest } = findUser;
    return rest;
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
