import { Test, TestingModule } from '@nestjs/testing';
import { AdsService } from './ads.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Ad } from './entities/ads.entity';
import { User } from '../users/entities/user.entity';
import { CreateAdDto } from './dto/create-ads.dto';
import { NotFoundException } from '@nestjs/common';

describe('AdsService', () => {
  let service: AdsService;
  let userRepository: Repository<User>;
  let dataSource: DataSource;

  const mockUser = {
    user_id: 1,
    email: 'test@test.com',
    userName: 'TestUser',
    isFromGoogle:false
  };

  const mockAd = {
    adId: 1,
    technicalInfo: "اطلاعات فنی جدید درباره آگهی.",
    address: "خیابان جدید 123",
    mobileNum: "123-456-7890",
    city: "شهر جدید",
    carName: "هوندا سیویک",
    picsUrl: "http://example.com/newpic.jpg",
    additionalInfo: "اطلاعات اضافی جدید درباره آگهی.",
    price: 12000,
    date: "2024-06-17",
    year: 2023,
    status: 1,
    model: "مدل جدید",
    videoUrl: "http://example.com/newvideo.mp4",
    brand: "برند جدید",
    color: "آبی",
    distance: 20000,
    accidental: false,
    insurance: 2,
    motor: "توربو",
    fuel: "گازسوز",
    userId: 1
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  const mockDataSource = {
    manager: {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      remove: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdsService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<AdsService>(AdsService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    dataSource = module.get<DataSource>(DataSource);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return an ad', async () => {
      const createAdDto: CreateAdDto = {
        technicalInfo: "اطلاعات فنی جدید درباره آگهی.",
        address: "خیابان جدید 123",
        mobileNum: "123-456-7890",
        city: "شهر جدید",
        carName: "هوندا سیویک",
        picsUrl: "http://example.com/newpic.jpg",
        additionalInfo: "اطلاعات اضافی جدید درباره آگهی.",
        price: 12000,
        date: "2024-06-17",
        year: 2023,
        status: 1,
        model: "مدل جدید",
        videoUrl: "http://example.com/newvideo.mp4",
        brand: "برند جدید",
        color: "آبی",
        distance: 20000,
        accidental: false,
        insurance: 2,
        motor: "توربو",
        fuel: "گازسوز",
        userId: 1
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockDataSource.manager.create.mockReturnValue(mockAd);
      mockDataSource.manager.save.mockResolvedValue(mockAd);

      const result = await service.create(createAdDto);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { user_id: 1 } });
      expect(mockDataSource.manager.create).toHaveBeenCalledWith(Ad, createAdDto);
      expect(mockDataSource.manager.save).toHaveBeenCalledWith(mockAd);
      expect(result).toEqual("Ad created successfully ");
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const createAdDto: CreateAdDto = {
        technicalInfo: "اطلاعات فنی جدید درباره آگهی.",
        address: "خیابان جدید 123",
        mobileNum: "123-456-7890",
        city: "شهر جدید",
        carName: "هوندا سیویک",
        picsUrl: "http://example.com/newpic.jpg",
        additionalInfo: "اطلاعات اضافی جدید درباره آگهی.",
        price: 12000,
        date: "2024-06-17",
        year: 2023,
        status: 1,
        model: "مدل جدید",
        videoUrl: "http://example.com/newvideo.mp4",
        brand: "برند جدید",
        color: "آبی",
        distance: 20000,
        accidental: false,
        insurance: 2,
        motor: "توربو",
        fuel: "گازسوز",
        userId: 999
      };

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createAdDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByUserId', () => {
    it('should return ads for a specific user', async () => {
      mockDataSource.manager.find.mockResolvedValue([mockAd]);

      const result = await service.findByUserId(1);

      expect(mockDataSource.manager.find).toHaveBeenCalledWith(Ad, { where: { userId: 1 } });
      expect(result).toEqual([mockAd]);
    });

    it('should throw NotFoundException if no ads found', async () => {
      mockDataSource.manager.find.mockResolvedValue([]);

      await expect(service.findByUserId(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return an ad if found', async () => {
      mockDataSource.manager.findOne.mockResolvedValue(mockAd);

      const result = await service.findOne(1);

      expect(mockDataSource.manager.findOne).toHaveBeenCalledWith(Ad, { where: { adId: 1 } });
      expect(result).toEqual(mockAd);
    });

    it('should throw NotFoundException if ad not found', async () => {
      mockDataSource.manager.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all ads', async () => {
      mockDataSource.manager.find.mockResolvedValue([mockAd]);

      const result = await service.findAll();

      expect(mockDataSource.manager.find).toHaveBeenCalledWith(Ad);
      expect(result).toEqual([mockAd]);
    });

  
  });


  describe('remove', () => {
    it('should remove the ad', async () => {
      mockDataSource.manager.findOne.mockResolvedValue(mockAd);
      mockDataSource.manager.remove.mockResolvedValue(mockAd);

      await service.remove(1);

      expect(mockDataSource.manager.findOne).toHaveBeenCalledWith(Ad, { where: { adId: 1 } });
      expect(mockDataSource.manager.remove).toHaveBeenCalledWith(Ad, mockAd);
    });

    it('should throw NotFoundException if ad not found', async () => {
      mockDataSource.manager.findOne.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('changeStatus', () => {
    it('should change the status of the ad', async () => {
      const updatedAd = { ...mockAd, status: 1 };
      mockDataSource.manager.findOne.mockResolvedValue(mockAd);
      mockDataSource.manager.save.mockResolvedValue(updatedAd);

      await service.changeStatus(1, 1);

      expect(mockDataSource.manager.findOne).toHaveBeenCalledWith(Ad, { where: { adId: 1 } });
      expect(mockDataSource.manager.save).toHaveBeenCalledWith(updatedAd);
    });

    it('should throw NotFoundException if ad not found', async () => {
      mockDataSource.manager.findOne.mockResolvedValue(null);

      await expect(service.changeStatus(1, 1)).rejects.toThrow(NotFoundException);
    });
  });
});
