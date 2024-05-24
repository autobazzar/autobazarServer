import { Module } from '@nestjs/common';
import { RatesService } from './rates.service';
import { RatesController } from './rates.controller';
import { JwtModule } from '@nestjs/jwt';
import { Rate } from './entities/rate.entity'; 
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Ad } from 'src/ads/entities/ads.entity';
@Module({
  imports:[JwtModule,TypeOrmModule.forFeature([Rate,User,Ad])],
  controllers: [RatesController],
  providers: [RatesService],
})
export class RatesModule {}
