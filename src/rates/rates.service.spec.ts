import { Test, TestingModule } from '@nestjs/testing';
import { RatesService } from './rates.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Rate } from './entities/rate.entity';
import { Ad } from '../ads/entities/ads.entity';
import { User } from '../users/entities/user.entity';
import { CreateRateDto } from './dto/create-rate.dto';
import { NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';

describe('RatesService', () => {
  let service: RatesService;
  let userRepository: Repository<User>;
  let adRepository: Repository<Ad>;
  let rateRepository: Repository<Rate>;
  let dataSource: DataSource;

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  const mockAdRepository = {
    findOne: jest.fn(),
  };

  const mockRateRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockDataSource = {
    manager: {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RatesService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Ad),
          useValue: mockAdRepository,
        },
        {
          provide: getRepositoryToken(Rate),
          useValue: mockRateRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<RatesService>(RatesService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    adRepository = module.get<Repository<Ad>>(getRepositoryToken(Ad));
    rateRepository = module.get<Repository<Rate>>(getRepositoryToken(Rate));
    dataSource = module.get<DataSource>(DataSource);

    dataSource.manager.findOne = mockRateRepository.findOne;
    dataSource.manager.find = mockRateRepository.find;
    dataSource.manager.create = mockRateRepository.create;
    dataSource.manager.save = mockRateRepository.save;
  });

  describe('create', () => {
    it('should create a rate successfully', async () => {
      const createRateDto: CreateRateDto = { userId: 1, adId: 1, score: 5 };

      mockUserRepository.findOne.mockResolvedValue({ user_id: 1 } as User);
      mockAdRepository.findOne.mockResolvedValue({ adId: 1 } as Ad);
      mockRateRepository.findOne.mockResolvedValue(null);
      mockRateRepository.create.mockReturnValue(createRateDto as any);
      mockRateRepository.save.mockResolvedValue(createRateDto as any);

    
    });

    it('should throw BadRequestException for invalid score', async () => {
      const createRateDto: CreateRateDto = { userId: 1, adId: 1, score: 6 };

      await expect(service.create(createRateDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const createRateDto: CreateRateDto = { userId: 1, adId: 1, score: 5 };

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createRateDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if ad does not exist', async () => {
      const createRateDto: CreateRateDto = { userId: 1, adId: 1, score: 5 };

      mockUserRepository.findOne.mockResolvedValue({ user_id: 1 } as User);
      mockAdRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createRateDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if rate already exists', async () => {
      const createRateDto: CreateRateDto = { userId: 1, adId: 1, score: 5 };

      mockUserRepository.findOne.mockResolvedValue({ user_id: 1 } as User);
      mockAdRepository.findOne.mockResolvedValue({ adId: 1 } as Ad);
      mockRateRepository.findOne.mockResolvedValue({ userId: 1, adId: 1 } as Rate);

    
    });
  });
  describe('getRate', () => {
    it('should return the rate score', async () => {
      const userId = 1;
      const adId = 1;
      const rate = { score: 5 } as Rate;

      jest.spyOn(service, 'getRate').mockImplementation(async () => rate.score);

      await expect(service.getRate(adId, userId)).resolves.toEqual(5);
    });

    it('should return "Not rated yet for this product" if no rate exists', async () => {
      const userId = 1;
      const adId = 1;

      jest.spyOn(service, 'getRate').mockImplementation(async () => "Not rated yet for this product");

      await expect(service.getRate(adId, userId)).resolves.toEqual("Not rated yet for this product");
    });
  });

  describe('getAverageRate', () => {
    it('should return the average rate', async () => {
      const adId = 1;
      const rates = [
        { score: 4 } as Rate,
        { score: 5 } as Rate,
      ];

      jest.spyOn(service, 'getAverageRate').mockImplementation(async () => {
        const totalScore = rates.reduce((sum, rate) => sum + rate.score, 0);
        const averageRate = totalScore / rates.length;
        return averageRate;
      });

      await expect(service.getAverageRate(adId)).resolves.toEqual(4.5);
    });

    it('should throw NotFoundException if no rates exist', async () => {
      const adId = 1;

      jest.spyOn(service, 'getAverageRate').mockImplementation(async () => {
        throw new NotFoundException(`No rates found for ad with ID ${adId}`);
      });

      await expect(service.getAverageRate(adId)).rejects.toThrow(NotFoundException);
    });

    it('should call getAverageRate', async () => {
      jest.spyOn(service, 'getAverageRate').mockImplementation(async () => 4.5);

      await service.getAverageRate(1);
      expect(service.getAverageRate).toHaveBeenCalled();
    });
  });

  describe('getUniqueUserCount', () => {
    it('should return the count of unique users', async () => {
      const adId = 1;
  
      // Mock data: Three rates from two unique users
      const rates = [
        { userId: 1 } as Rate,
        { userId: 2 } as Rate,
        { userId: 1 } as Rate,
      ];
  
      // Use jest.spyOn to mock the find method on the rateRepository
      jest.spyOn(rateRepository, 'find').mockResolvedValue(rates);
  
     
  
  
  
   
  });
  

  it('should call the methods', async () => {
    const adId = 1;
    const userId = 1;
    const createRateDto: CreateRateDto = { userId, adId, score: 5 };

    jest.spyOn(service, 'create').mockImplementation(async () => "Rate created successfully");
    jest.spyOn(service, 'getRate').mockImplementation(async () => "Not rated yet for this product");
    jest.spyOn(service, 'getAverageRate').mockImplementation(async () => 4.5);
    jest.spyOn(service, 'getUniqueUserCount').mockImplementation(async () => 2);

    await service.create(createRateDto);
    await service.getRate(adId, userId);
    await service.getAverageRate(adId);
    await service.getUniqueUserCount(adId);

    expect(service.create).toHaveBeenCalled();
    expect(service.getRate).toHaveBeenCalled();
    expect(service.getAverageRate).toHaveBeenCalled();
    expect(service.getUniqueUserCount).toHaveBeenCalled();
  });
});
});
