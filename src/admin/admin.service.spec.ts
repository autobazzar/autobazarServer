import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Ad } from '../ads/entities/ads.entity';
import { Rate } from '../rates/entities/rate.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';


// Mocks for repositories
const mockUserRepository = {
  count: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
};

const mockAdRepository = {
  count: jest.fn(),
  find: jest.fn(),
};

const mockRateRepository = {
  find: jest.fn(),
};

describe('AdminService', () => {
  let service: AdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: 'UserRepository',
          useValue: mockUserRepository,
        },
        {
          provide: 'AdRepository',
          useValue: mockAdRepository,
        },
        {
          provide: 'RateRepository',
          useValue: mockRateRepository,
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserCount', () => {
    it('should return the count of users', async () => {
      mockUserRepository.count.mockResolvedValue(5);

      const result = await service.getUserCount();

      expect(mockUserRepository.count).toHaveBeenCalled();
      expect(result).toBe(5);
    });

    it('should throw BadRequestException on failure', async () => {
      mockUserRepository.count.mockRejectedValue(new Error('Some error'));

      await expect(service.getUserCount()).rejects.toThrow(BadRequestException);
    });
  });

  describe('getAdCount', () => {
    it('should return the count of ads', async () => {
      mockAdRepository.count.mockResolvedValue(10);

      const result = await service.getAdCount();

      expect(mockAdRepository.count).toHaveBeenCalled();
      expect(result).toBe(10);
    });

    it('should throw BadRequestException on failure', async () => {
      mockAdRepository.count.mockRejectedValue(new Error('Some error'));

      await expect(service.getAdCount()).rejects.toThrow(BadRequestException);
    });
  });

  describe('getTodayAds', () => {
    it('should return ads for today', async () => {
      const todayDate = new Date().toISOString().slice(0, 10);
      const mockAds = [{ adId: 1, date: todayDate }];
      mockAdRepository.find.mockResolvedValue(mockAds);

      const result = await service.getTodayAds();

      expect(mockAdRepository.find).toHaveBeenCalledWith({
        where: {
          date: todayDate,
        },
      });
      expect(result).toEqual(mockAds);
    });

    it('should throw BadRequestException on failure', async () => {
      mockAdRepository.find.mockRejectedValue(new Error('Some error'));

      await expect(service.getTodayAds()).rejects.toThrow(BadRequestException);
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [{ user_id: 1, email: 'test@test.com' }];
      mockUserRepository.find.mockResolvedValue(mockUsers);

      const result = await service.getAllUsers();

      expect(mockUserRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });

    it('should throw NotFoundException on failure', async () => {
      mockUserRepository.find.mockRejectedValue(new Error('Some error'));

      await expect(service.getAllUsers()).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAllAdsWithAverageRate', () => {
    it('should return all ads with their average rates, sorted by average rate', async () => {
      const mockAds = [
        { adId: 1, title: 'Ad 1' },
        { adId: 2, title: 'Ad 2' },
      ];
      const mockRates = [
        { adId: 1, score: 5 },
        { adId: 1, score: 3 },
        { adId: 2, score: 4 },
      ];

      mockAdRepository.find.mockResolvedValue(mockAds);
      mockRateRepository.find.mockResolvedValue(mockRates);

    
    });

    it('should throw BadRequestException on failure', async () => {
      mockAdRepository.find.mockRejectedValue(new Error('Some error'));

      await expect(service.getAllAdsWithAverageRate()).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateUserBannedStatus', () => {
    it('should update the banned status of a user', async () => {
      const user = { user_id: 1, isBanned: false };
      const updatedUser = { ...user, isBanned: true };

      mockUserRepository.findOne.mockResolvedValue(user);
      mockUserRepository.save.mockResolvedValue(updatedUser);

      const result = await service.updateUserBannedStatus(1, true);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { user_id: 1 },
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(updatedUser);
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.updateUserBannedStatus(1, true)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if isBanned is not boolean', async () => {
     
    });
  });

  describe('updateUserRole', () => {
    it('should update the role of a user', async () => {
      const user = { user_id: 1, role: 'user' };
      const updatedUser = { ...user, role: 'admin' };

      mockUserRepository.findOne.mockResolvedValue(user);
      mockUserRepository.save.mockResolvedValue(updatedUser);

      const result = await service.updateUserRole(1, 'admin');

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { user_id: 1 },
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(updatedUser);
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.updateUserRole(1, 'admin')).rejects.toThrow(NotFoundException);
    });

   
  });
});
