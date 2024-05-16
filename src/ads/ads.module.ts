import { Module } from '@nestjs/common';
import { AdsService } from './ads.service';
import { AdsController } from './ads.controller';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { Ad } from './entities/ads.entity'; // Import Ad entity

import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports:[JwtModule,  MulterModule.register({
    dest: './uploads', 
  }), TypeOrmModule.forFeature([Ad]),],
  controllers: [AdsController],
  providers: [AdsService],
})
export class AdsModule {}
