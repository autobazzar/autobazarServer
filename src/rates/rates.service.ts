import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rate } from './entities/rate.entity';
import { CreateRateDto } from './dto/create-rate.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Injectable()
@ApiTags('rates')
export class RatesService {
  constructor(
    @InjectRepository(Rate)
    private readonly rateRepository: Repository<Rate>,
  ) {}

  // Method to create a new rate
  @ApiResponse({ status: 201, description: 'Rate created successfully', type: Rate })
  async create(createRateDto: CreateRateDto): Promise<Rate> {
    const { userId, adId, score } = createRateDto;

    // Create a new rate entity
    const newRate = this.rateRepository.create({ score });

    // Save the new rate in the database
    return await this.rateRepository.save(newRate);
  }

  // Method to get the average rate for a specific ad
  @ApiResponse({ status: 200, description: 'Average rate retrieved successfully', type: Number })
  async getAverageRate(adId: number): Promise<number> {
    // Find all rates for the specified ad
    const rates = await this.rateRepository.find({ where: { adId } as any});

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
