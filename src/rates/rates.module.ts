import { Module } from '@nestjs/common';
import { RatesService } from './rates.service';
import { RatesController } from './rates.controller';
import { JwtModule } from '@nestjs/jwt';
import { Rate } from './entities/rate.entity'; 
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[JwtModule,TypeOrmModule.forFeature([Rate])],
  controllers: [RatesController],
  providers: [RatesService],
})
export class RatesModule {}
