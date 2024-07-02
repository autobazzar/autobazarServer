import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, BadRequestException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, LoginUserDto, } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import { ApiBody, ApiNotFoundResponse, ApiOkResponse, ApiResponse } from '@nestjs/swagger';

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
          email: 'user@example.com'
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
          userName: 'exampleuser'
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
  @ApiBody({
    description: 'The data to update for the user.',
    type: UpdateUserDto,
    examples: {
     valid: {
        summary: 'Valid Request Example',
        value: {
          
          name: 'Person',
          phone: '7896543212',
          address: '434 Arr St',
        },
      },
      missingOldPassword: {
        summary: 'Request Example Without Password Change',
        value: {
          name: 'Updated Name',
          phone: '9876543210',
          address: '456 Elm St',
        },
      },
    },
  })
  async update(
    @Param('id') id: string,  // User ID from the route parameter.
    @Body() updateUserDto: UpdateUserDto  // DTO containing user data for the update.
  ) {
    // Convert the ID from a string to a number and pass it to the update method.
    try {
      return await this.usersService.update(+id, updateUserDto);
    } catch (error) {
      // Add custom error messages for different types of exceptions.
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User not found. Please check the ID and try again.');
      }
      if (error instanceof BadRequestException) {
        throw new BadRequestException('Old password is incorrect or invalid request data.');
      }
      // Re-throw the error if it is of a different type.
      throw error;
    }
  }
  @Get(':id/info')
  @ApiOkResponse({ description: 'User info retrieved successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async getUserInfo(@Param('id') id: string) {
      // Convert the ID from a string to a number and pass it to the getUserInfo method.
      return await this.usersService.getUserInfo(+id);
  }
  
  @Get(':id/isRegisteredByGoogle')
  @ApiOkResponse({ description: 'User registration method retrieved successfully', type: String })
  @ApiNotFoundResponse({ description: 'User not found' })
  async isRegisteredByGoogle(@Param('id') id: string) {
      // Convert the ID from a string to a number and pass it to the isRegisteredByGoogle method.
      return await this.usersService.isRegisteredByGoogle(+id);
  }
 
}
