import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, LoginUserDto, } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DataSource } from 'typeorm';
import { compare, hash } from 'bcrypt';
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

  // async update(id: number, updateUserDto: UpdateUserDto) {
  //   const user = await this.dataSource.manager.findOne(User,{ where: { user_id:id} } ); 
  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }
  //   return this.dataSource.manager.save(User,{ ...user, ...updateUserDto })
  // }

  remove(id: number) {
    return this.dataSource.manager.delete(User,{
      user_id:id,
    })
  }
  async getUserInfo(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      return { status: 'error', message: 'User not found' };
    }
    
    return {
       
            name: user.name,
            address: user.address,
            phone: user.phone
       
    };
}

async isRegisteredByGoogle(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      return { status: 'error', message: 'User not found' };
    }

    // If user has no password, it means the user is registered by Google
    if (!user.password) {
        return {  google: 'Yes' };
    } else {
        return {  google: 'No' };
    }
}

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.oldPassword) {
      // Check the old password
      const isPasswordValid = await compare(updateUserDto.oldPassword, user.password);
      if (!isPasswordValid) {
        throw new BadRequestException('Old password is incorrect');
      }
    }

    if (updateUserDto.password) {
      // Hash the new password if provided
      const hashedPassword = await hash(updateUserDto.password, 10);
      updateUserDto.password = hashedPassword;
    }

    if(updateUserDto.name) {
      user.name = updateUserDto.name;
    }
    
    if(updateUserDto.address) {
      user.address = updateUserDto.address;
    }
    
    if(updateUserDto.phone) {
      user.phone = updateUserDto.phone;
    }

    // Merge the updateUserDto into the existing user object
    Object.assign(user, updateUserDto);

    // Save the updated user
    await this.dataSource.manager.save(user);

    return this.getProfile(user);
  }


}
