import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { RatesService } from './rates.service';
import { CreateRateDto } from './dto/create-rate.dto';
import { ApiTags, ApiBody, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Rates') // Adding Swagger tags for the controller
@Controller('rates')
export class RatesController {
  constructor(private readonly ratesService: RatesService) {}

  // POST request to create a rate
  // Example: POST /rates
  @ApiBody({ type: CreateRateDto }) // Swagger documentation for request body
  @ApiResponse({ status: 201, description: 'Rate created successfully' })
  @ApiResponse({ status: 400, description: 'Failed to create rate' })
  @Post()
  async create(@Body() createRateDto: CreateRateDto) {
    return this.ratesService.create(createRateDto);
  }

  // GET request to get the average rate for a specific ad
  // Example: GET /rates/:adId/average
  @ApiParam({ name: 'adId', description: 'ID of the ad to calculate average rate' }) // Swagger documentation for route parameter
  @ApiResponse({ status: 200, description: 'Average rate retrieved successfully' })
  @Get(':adId/average')
  async getAverageRate(@Param('adId') adId: string) {
    return this.ratesService.getAverageRate(+adId);
  }
}
