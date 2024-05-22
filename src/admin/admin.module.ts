import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Ad } from 'src/ads/entities/ads.entity';
import { Rate } from 'src/rates/entities/rate.entity';

@Module({
  imports:[JwtModule,TypeOrmModule.forFeature([User, Ad, Rate]),],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}