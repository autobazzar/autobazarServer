import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Ad } from '../ads/entities/ads.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
@ApiTags('comments')
export class CommentsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Ad)
    private readonly adRepository: Repository<Ad>,
    @InjectRepository(Comment)
    private dataSource: DataSource
    
  ) {}

  @ApiResponse({ status: 201, description: 'Comment created successfully', type: Comment })
  async create(createCommentDto: CreateCommentDto) {
    const { userId, adId, comment } = createCommentDto;

    // Check if the user exists
    const user = await this.userRepository.findOne({ where: { user_id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if the ad exists
    const ad = await this.adRepository.findOne({ where: { adId: adId } });
    if (!ad) {
      throw new NotFoundException('Ad not found');
    }

    // Check if the comment already exists
    const existingComment = await this.dataSource.manager.findOne(Comment,{
      where: { userId: userId, adId: adId },
    });
    if (existingComment) {
      throw new ConflictException('Comment already exists for this user and ad');
    }

    // Create a new comment entity
    const newComment = this.dataSource.manager.create(Comment, createCommentDto);
    await this.dataSource.manager.save(newComment);

    return "Comment created successfully";
  }

  // Method to get the comment for a specific ad and user
  async getComment(adId: number, userId: number) {
    // Find the comment for the specified ad and user
    const comment = await this.dataSource.manager.findOne(Comment, { where: { adId, userId } });

    // If comment is not found, return "not commented yet"
    if (!comment) {
      return "Not commented yet for this product";
    }

    // If comment is found, return the comment
    return comment.comment;
  }

  @ApiResponse({ status: 200, description: 'All comments for the ad retrieved successfully', type: [Comment] })
  async getAllCommentsForAd(adId: number) {
    // Find all comments for the specified ad
    const comments = await this.dataSource.manager.find(Comment,{where: { adId }  });

    // Check if there are any comments for the ad
    if (comments.length === 0) {
      throw new NotFoundException(`No comments found for ad with ID ${adId}`);
    }

    // Return all comments
    return comments;
  }


}


