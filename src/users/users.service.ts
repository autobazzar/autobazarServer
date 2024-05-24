import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, LoginUserDto, } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DataSource } from 'typeorm';
import { compare } from 'bcrypt';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UsersService {
  constructor(private dataSource: DataSource, private jwtService: JwtService) { }

  async create(user: CreateUserDto) {
    const newUser = this.dataSource.manager.create(User, user);
    await this.dataSource.manager.save(newUser);
    return this.getProfile(newUser);
  }

  async loginUser(user: LoginUserDto, fromGoogle = false) {
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
    return { token: this.jwtService.sign({ ...rest }, { secret: "secretKey" }) };
  }

 
  async findAll() {

    const users = await this.dataSource.manager.find(User ); 
    if (!users) {
      throw new NotFoundException('No users found'); 
    }
    return users; 
    
  }

  async findOne(id: number) {
    const user = await this.dataSource.manager.findOne(User,{ where: { user_id:id} } ); 
    if (!user) {
      throw new NotFoundException('User not found'); 
    }
    return user; 
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
