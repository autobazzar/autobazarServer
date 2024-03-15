import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, LoginUserDto, } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Post('login')
  async logInUser(@Body() requestBody: LoginUserDto, @Res() res: Response) {
    const { isFromGoogle, ...user } = requestBody;
    const result = await this.usersService.loginUser(user, isFromGoogle);

    if (result) {
      res.status(HttpStatus.OK).send(result);
    } else {
      res.status(HttpStatus.BAD_REQUEST).send({ 'message': 'user not found!' });
    }
  }

  @Post('/sign-up')
  async createUser(@Body() userToCreate: CreateUserDto, @Res() res: Response) {
    try {
      const result = await this.usersService.create(userToCreate);
      res.status(HttpStatus.OK).send(result);
    } catch (e) {
      res.status(HttpStatus.BAD_REQUEST).send({ 'message': 'a user already exists with the email!' });
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
