import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Rate } from './entities/rate.entity';
import { CreateRateDto } from './dto/create-rate.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Injectable()
@ApiTags('rates')
export class RatesService {
  constructor(
    @InjectRepository(Rate)
    
    private dataSource: DataSource
  ) {}

  // Method to create a new rate
  @ApiResponse({ status: 201, description: 'Rate created successfully', type: Rate })
  async create(createRateDto: CreateRateDto) {
    // Check if the score is within the allowed range (1-5)
    if (![1, 2, 3, 4, 5].includes(createRateDto.score)) {
      throw new BadRequestException('Score must be either 1, 2, 3, 4, or 5');
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
}
