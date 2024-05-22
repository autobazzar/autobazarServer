import { Controller, Get, Param } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiTags, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Ad } from '../ads/entities/ads.entity';
import { User } from '../users/entities/user.entity';
@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiResponse({
    status: 200,
    description: 'Number of users retrieved successfully',
    schema: {
      example: 10
    }
  })
  @Get('user-count')
  async getUserCount() {
    return this.adminService.getUserCount();
  }

  @ApiResponse({
    status: 200,
    description: 'Number of ads retrieved successfully',
    schema: {
      example: 20
    }
  })
  @Get('ad-count')
  async getAdCount() {
    return this.adminService.getAdCount();
  }

  @ApiResponse({
    status: 200,
    description: 'Ads for today retrieved successfully',
    type: [Ad]
  })

  @Get('today-ads')
  async getTodayAds() {
    return (await this.adminService.getTodayAds()).length;
  }

  @ApiResponse({
    status: 200,
    description: 'All users retrieved successfully',
    type: [User]
  })
  @Get('all-users')
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @ApiResponse({
    status: 200,
    description: 'Ads with average rate retrieved successfully',
    type: [Ad]
  })
  @Get('ads-with-average-rate')
  async getAllAdsWithAverageRate() {
    return this.adminService.getAllAdsWithAverageRate();
  }
}
