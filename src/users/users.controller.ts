import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, LoginUserDto, LoginWithGoogleDto } from './dto/create-user.dto';
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
  async logInUser(@Body() user: LoginUserDto, @Res() res: Response) {

    const result = await this.usersService.loginUser(user);

    if (result) {
      res.status(HttpStatus.OK).send(result);
    } else {
      res.status(HttpStatus.BAD_REQUEST).send({ 'error': 'user not found!' });
    }
  }
  @Post('/login-google')
  async logInUserGoogle(@Body() user: LoginWithGoogleDto, @Res() res: Response) {

    const result = await this.usersService.loginUser(user, true);

    if (result) {
      res.status(HttpStatus.OK).send(result);
    } else {
      res.status(HttpStatus.BAD_REQUEST).send({ 'error': 'user not found!' });
    }
  }

  @Post('/sign-up')
  async createUser(@Body() userToCreate: CreateUserDto) {
    await this.usersService.create(userToCreate);
    return true;
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
