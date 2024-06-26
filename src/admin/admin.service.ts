import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm'; // Import In
import { ApiTags } from '@nestjs/swagger';
import { Ad } from '../ads/entities/ads.entity';
import { User } from '../users/entities/user.entity';
import { Rate } from '../rates/entities/rate.entity';
import { getTodayDate } from 'src/utils/dateService';

@Injectable()
@ApiTags('Admin')
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Ad)
    private readonly adRepository: Repository<Ad>,
    @InjectRepository(Rate)
    private readonly rateRepository: Repository<Rate>,
  ) {}

  // Function to get count of users
  async getUserCount(): Promise<number> {
    try {
      return await this.userRepository.count();
    } catch (error) {
      throw new BadRequestException('Failed to get user count');
    }
  }

  // Function to get count of ads
  async getAdCount(): Promise<number> {
    try {
      return await this.adRepository.count();
    } catch (error) {
      throw new BadRequestException('Failed to get ad count');
    }
  }

  // Function to get ads for today
  async getTodayAds(): Promise<Ad[]> {
    try {
      return await this.adRepository.find({
        where: {
          date: getTodayDate(),
        },
      });
    } catch (error) {
      throw new BadRequestException('Failed to get ads for today');
    }
  }

  // Function to get all users with details
  async getAllUsers(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      throw new NotFoundException('Failed to get all users');
    }
  }

  // API method to get all ads with average rate, sorted by average rate
  async getAllAdsWithAverageRate(): Promise<any[]> {
    try {
      const ads = await this.adRepository.find();
      const adIds = ads.map(ad => ad.adId);

      const rates = await this.rateRepository.find({
        where: {
          adId: In(adIds), // Use In instead of $in
        },
      });

      const adRateMap = {};

      rates.forEach(rate => {
        if (!adRateMap[rate.adId]) {
          adRateMap[rate.adId] = {
            totalScore: rate.score,
            count: 1,
          };
        } else {
          adRateMap[rate.adId].totalScore += rate.score;
          adRateMap[rate.adId].count++;
        }
      });

      const adsWithAverageRate = ads.map(ad => {
        const rateData = adRateMap[ad.adId];
        const averageRate = rateData ? rateData.totalScore / rateData.count : 0;
        return {
          ...ad,
          averageRate,
        };
      });

      adsWithAverageRate.sort((a, b) => a.averageRate - b.averageRate);

      return adsWithAverageRate;
    } catch (error) {
      throw new BadRequestException('Failed to get ads with average rate');
    }
  }

  async updateUserBannedStatus(id: number, isBanned: boolean): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        user_id: id 
      }});
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    // Ensure that isBanned is a boolean value
    if (typeof isBanned !== 'boolean') {
      throw new BadRequestException('isBanned must be a boolean value');
    }
    user.isBanned = isBanned;
    return this.userRepository.save(user);
  }

  async updateUserRole(id: number, role: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        user_id: id 
      }});
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    // Additional validation for role, for example, ensuring it is a valid role
    if (!isValidRole(role)) {
      throw new BadRequestException('Invalid role');
    }
    user.role = role;
    return this.userRepository.save(user);
  }
}

// Example  to validate the role
function isValidRole(role: string): boolean {
  // Add your validation logic here, for example:
  const validRoles = ['admin', 'user', 'moderator'];
  return validRoles.includes(role);

}
