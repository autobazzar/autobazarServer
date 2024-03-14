import { Injectable } from '@nestjs/common';
import { CreateUserDto, LoginUserDto, LoginWithGoogleDto } from './dto/create-user.dto';
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
    return { token: this.jwtService.sign({ ...rest }, { secret: "secretKey" }) };
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
