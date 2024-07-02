import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { JwtModule } from '@nestjs/jwt';
import { Comment } from './entities/comment.entity'; 
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Ad } from 'src/ads/entities/ads.entity';
@Module({
  imports:[JwtModule,TypeOrmModule.forFeature([Comment,User,Ad])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
