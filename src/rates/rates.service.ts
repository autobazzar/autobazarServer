import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Rate } from './entities/rate.entity';
import { CreateRateDto } from './dto/create-rate.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Ad } from '../ads/entities/ads.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
@ApiTags('rates')
export class RatesService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Ad)
    private readonly adRepository: Repository<Ad>,
    @InjectRepository(Rate)
    private dataSource: DataSource
    
  ) {}

  @ApiResponse({ status: 201, description: 'Rate created successfully', type: Rate })
  async create(createRateDto: CreateRateDto) {
    const { userId, adId, score } = createRateDto;

    // Check if the score is within the allowed range (1-5)
    if (![1, 2, 3, 4, 5].includes(score)) {
      throw new BadRequestException('Score must be either 1, 2, 3, 4, or 5');
    }

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

    // Check if the rate already exists
    const existingRate = await this.dataSource.manager.findOne(Rate,{
      where: { userId: userId, adId: adId },
    });
    if (existingRate) {
      throw new ConflictException('Rate already exists for this user and ad');
    }


    // Create a new rate entity
    const newRate = this.dataSource.manager.create(Rate, createRateDto);
    await this.dataSource.manager.save(newRate);

    return "Rate created successfully";
  }

  // Method to get the rate for a specific ad and user
  async getRate(adId: number, userId: number) {
    // Find the rate for the specified ad and user
    const rate = await this.dataSource.manager.findOne(Rate, { where: { adId, userId } });

    // If rate is not found, return "not rated yet"
    if (!rate) {
      return "Not rated yet for this product";
    }

    // If rate is found, return the score
    return rate.score;
  }

  // Method to get the average rate for a specific ad
  @ApiResponse({ status: 200, description: 'Average rate retrieved successfully', type: Number })
  async getAverageRate(adId: number) {
    // Find all rates for the specified ad
    const rates = await this.dataSource.manager.find(Rate, { where: { adId } });

    // Check if there are any rates for the ad
    if (!rates || rates.length === 0) {
      throw new NotFoundException(`No rates found for ad with ID ${adId}`);
    }

    // Calculate the average rate
    const totalScore = rates.reduce((sum, rate) => sum + rate.score, 0);
    const averageRate = totalScore / rates.length;

    return averageRate;
    
  }


    // Method to get the count of unique user IDs for a specific ad
   
    @ApiResponse({ status: 200, description: 'Unique user count retrieved successfully', type: Number })
    async getUniqueUserCount(adId: number): Promise<number> {
      // Find all rates for the specified ad
      const rates = await this.dataSource.manager.find(Rate, { where: { adId } });
  
      // Check if there are any rates for the ad
      if (!rates || rates.length === 0) {
        throw new NotFoundException(`No rates found for ad with ID ${adId}`);
      }
  
      // Calculate the count of unique user IDs
      const uniqueUserIds = new Set(rates.map(rate => rate.userId));
      const uniqueUserCount = uniqueUserIds.size;
  
      return uniqueUserCount;
    }
}
