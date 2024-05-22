import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, LoginUserDto, } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }
  @ApiBody({
    type: LoginUserDto,
    examples: {
      example1: {
        summary: 'Example request body for login',
        value: {
          email: 'user@example.com',
          password: 'password123'
        }
      }
    },
    schema: {
      properties: {
        email: {
          type: 'string',
          format: 'email',
          description: 'User email address'
        },
        password: {
          type: 'string',
          description: 'User password'
        }
      },
      required: ['email', 'password']
    }
  })
  @ApiResponse({ status: 200, description: 'User logged in', schema: { example: 'JWT token' } })
  @ApiResponse({ status: 400, description: 'User not found', schema: { example: { message: 'user not found!' } } })
  
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
  @ApiBody({
    type: CreateUserDto,
    examples: {
      example1: {
        summary: 'Example request body for sign-up',
        value: {
          userName: 'exampleuser',
          email: 'user@example.com',
          password: 'password123'
        }
      }
    },
    schema: {
      properties: {
        userName: {
          type: 'string',
          description: 'User name'
        },
        email: {
          type: 'string',
          format: 'email',
          description: 'User email address'
        },
        password: {
          type: 'string',
          description: 'User password'
        }
      },
      required: ['userName', 'email', 'password']
    }
  })
  @ApiResponse({ status: 200, description: 'User created', schema: { example: 'User details' } })
  @ApiResponse({ status: 400, description: 'User already exists', schema: { example: { message: 'a user already exists with the email!' } } })
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
