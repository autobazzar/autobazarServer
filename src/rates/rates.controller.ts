import { Controller, Post, Body, Param, Get, HttpStatus, Res, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { RatesService } from './rates.service';
import { CreateRateDto } from './dto/create-rate.dto';
import { ApiTags, ApiBody, ApiResponse, ApiParam, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
@ApiTags('Rates') // Adding Swagger tags for the controller
@Controller('rates')
export class RatesController {
  constructor(private readonly ratesService: RatesService) {}

  // POST request to create a rate
  @ApiOperation({ summary: 'Create a new rate' })
  @ApiBody({
    type: CreateRateDto,
    examples: {
      example1: {
        summary: 'Example request body',
        value: {
          score: 5,
          userId: 123,
          adId: 1
        }
      }
    },
    schema: {
      properties: {
        score: {
          type: 'integer',
          minimum: 1,
          maximum: 5,
          description: 'The score must be an integer between 1 and 5'
        },
        userId: {
          type: 'integer',
          description: 'The ID of the user'
        },
        adId: {
          type: 'integer',
          description: 'The ID of the ad'
        }
      },
      required: ['score', 'userId', 'adId']
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Rate created successfully',
    schema: {
      example: {
        id: 1,
        score: 5,
        userId: 123,
        adId: 1,
        createdAt: "2024-05-21T12:34:56Z",
        updatedAt: "2024-05-21T12:34:56Z"
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Failed to create rate',
    schema: {
      example: {
        statusCode: 400,
        message: "Failed to create rate",
        error: "Bad Request"
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'User or Ad not found',
    schema: {
      example: {
        statusCode: 404,
        message: "User not found",
        error: "Not Found"
      }
    }
  })
  @ApiResponse({
    status: 409,
    description: 'Rate already exists for this user and ad',
    schema: {
      example: {
        statusCode: 409,
        message: "Rate already exists for this user and ad",
        error: "Conflict"
      }
    }
  })
  @Post()
  async create(@Body() createRateDto: CreateRateDto, @Res() res: Response) {
    try {
      const result = await this.ratesService.create(createRateDto);
      res.status(HttpStatus.CREATED).send(result);
    } catch (error) {
      if (error instanceof BadRequestException) {
        res.status(HttpStatus.BAD_REQUEST).send({ message: error.message });
      } else if (error instanceof NotFoundException) {
        res.status(HttpStatus.NOT_FOUND).send({ message: error.message });
      } else if (error instanceof ConflictException) {
        res.status(HttpStatus.CONFLICT).send({ message: error.message });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: 'An unexpected error occurred' });
      }
    }
  }


  // GET request to get the average rate for a specific ad
  @ApiOperation({ summary: 'Get the average rate for a specific ad' })
  @ApiParam({ name: 'adId', description: 'ID of the ad to calculate average rate' }) // Swagger documentation for route parameter
  @ApiResponse({
    status: 200,
    description: 'Average rate retrieved successfully',
    schema: {
      example: {
        adId: 1,
        averageRate: 4.2
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Ad not found',
    schema: {
      example: {
        statusCode: 404,
        message: "Ad not found",
        error: "Not Found"
      }
    }
  })
  @Get(':adId/average')
  async getAverageRate(@Param('adId') adId: string) {
    return this.ratesService.getAverageRate(+adId);
  }

  // GET request to get the rate for a specific ad by user
  @ApiOperation({ summary: 'Get the rate for a specific ad by user' })
  @ApiParam({ name: 'adId', description: 'ID of the ad' }) // Swagger documentation for route parameter
  @ApiParam({ name: 'userId', description: 'ID of the user' }) // Swagger documentation for route parameter
  @ApiResponse({
    status: 200,
    description: 'Rate retrieved successfully',
    schema: {
      example: {
        rate: 4
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Rate not found',
    schema: {
      example: {
        statusCode: 404,
        message: "Rate not found",
        error: "Not Found"
      }
    }
  })
  @Get(':adId/user/:userId')
  async getRate(@Param('adId') adId: string, @Param('userId') userId: string) {
    return this.ratesService.getRate(+adId, +userId);
  }
}
