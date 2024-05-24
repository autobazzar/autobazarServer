import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiTags, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { Ad } from '../ads/entities/ads.entity';
import { User } from '../users/entities/user.entity';
@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

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

  @Patch('user/:id/banned-status')
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({
    schema: {
      properties: {
        isBanned: {
          type: 'boolean',
          description: 'The new value for the banned status (true/false)',
        },
      },
      required: ['isBanned'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User banned status updated successfully',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input: isBanned must be a boolean value',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async updateUserBannedStatus(@Param('id') id: number, @Body() isBanned: { isBanned: boolean }) {
    return this.adminService.updateUserBannedStatus(id, isBanned.isBanned);
  }

  @Patch('user/:id/role')
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({
    schema: {
      properties: {
        role: {
          type: 'string',
          description: 'The new role for the user it must be admin or user',
        },
      },
      required: ['role'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User role updated successfully',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input: Invalid role',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async updateUserRole(@Param('id') id: number, @Body() role: { role: string }) {
    return this.adminService.updateUserRole(id, role.role);
  }
}
