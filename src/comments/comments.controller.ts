import { Controller, Post, Body, Param, Get, HttpStatus, Res, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ApiTags, ApiBody, ApiResponse, ApiParam, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Comments') // Adding Swagger tags for the controller
@Controller('comments')
export class CommentsController {
  constructor(private readonly ratesService: CommentsService) {}

  // POST request to create a comment
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiBody({
    type: CreateCommentDto,
    examples: {
      example1: {
        summary: 'Example request body',
        value: {
          comment: "Great ad!",
          userId: 123,
          adId: 1
        }
      }
    },
    schema: {
      properties: {
        comment: {
          type: 'string',
          description: 'The comment text'
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
      required: ['comment', 'userId', 'adId']
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Comment created successfully',
    schema: {
      example: {
        id: 1,
        comment: "Great ad!",
        userId: 123,
        adId: 1,
        createdAt: "2024-05-21T12:34:56Z",
        updatedAt: "2024-05-21T12:34:56Z"
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Failed to create comment',
    schema: {
      example: {
        statusCode: 400,
        message: "Failed to create comment",
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
    description: 'Comment already exists for this user and ad',
    schema: {
      example: {
        statusCode: 409,
        message: "Comment already exists for this user and ad",
        error: "Conflict"
      }
    }
  })
  @Post()
  async create(@Body() createCommentDto: CreateCommentDto, @Res() res: Response) {
    try {
      const result = await this.ratesService.create(createCommentDto);
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


  // GET request to get the comment for a specific ad by user
  @ApiOperation({ summary: 'Get the comment for a specific ad by user' })
  @ApiParam({ name: 'adId', description: 'ID of the ad' }) // Swagger documentation for route parameter
  @ApiParam({ name: 'userId', description: 'ID of the user' }) // Swagger documentation for route parameter
  @ApiResponse({
    status: 200,
    description: 'Comment retrieved successfully',
    schema: {
      example: {
        comment: "Great ad!"
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Comment not found',
    schema: {
      example: {
        statusCode: 404,
        message: "Comment not found",
        error: "Not Found"
      }
    }
  })
  @Get(':adId/user/:userId')
  async getComment(@Param('adId') adId: string, @Param('userId') userId: string) {
    return this.ratesService.getComment(+adId, +userId);
  }
  @ApiOperation({ summary: 'Get all comments for a specific ad' })
  @ApiParam({ name: 'adId', description: 'ID of the ad' })
  @ApiResponse({
    status: 200,
    description: 'All comments for the ad retrieved successfully',
    schema: {
      example: [
        {
          rateId: 1,
          comment: "Great ad!",
          userId: 123,
          adId: 1
        },
        {
          rateId: 2,
          comment: "Not bad",
          userId: 124,
          adId: 1
        }
      ]
    }
  })
  @ApiResponse({
    status: 404,
    description: 'No comments found for the ad',
    schema: {
      example: {
        statusCode: 404,
        message: "No comments found for ad with ID 1",
        error: "Not Found"
      }
    }
  })
  @Get(':adId/comments')
  async getAllCommentsForAd(@Param('adId') adId: string) {
    return this.ratesService.getAllCommentsForAd(+adId);
  }

}
