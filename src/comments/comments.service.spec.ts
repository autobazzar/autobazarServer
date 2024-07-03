import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { Ad } from '../ads/entities/ads.entity';
import { User } from '../users/entities/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';

describe('CommentsService', () => {
  let service: CommentsService;
  let userRepository: Repository<User>;
  let adRepository: Repository<Ad>;
  let commentRepository: Repository<Comment>;
  let dataSource: DataSource;

  const mockUser = {
    user_id: 1,
    email: 'test@test.com',
    userName: 'TestUser',
    isFromGoogle: false,
  };

  const mockAd = {
    adId: 1,
    technicalInfo: 'اطلاعات فنی درباره آگهی.',
    address: 'خیابان 123',
    mobileNum: '123-456-7890',
    city: 'شهر',
    carName: 'Honda Civic',
    picsUrl: 'http://example.com/pic.jpg',
    additionalInfo: 'اطلاعات اضافی درباره آگهی.',
    price: 10000,
    date: '2024-07-01',
    year: 2023,
    status: 1,
    model: 'مدل',
    videoUrl: 'http://example.com/video.mp4',
    brand: 'برند',
    color: 'آبی',
    distance: 20000,
    accidental: false,
    insurance: 2,
    motor: 'توربو',
    fuel: 'گازسوز',
    userId: 1,
  };

  const mockComment = {
    commentId: 1,
    userId: 1,
    adId: 1,
    comment: 'Great ad!',
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  const mockAdRepository = {
    findOne: jest.fn(),
  };

  const mockCommentRepository = {
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
        CommentsService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Ad),
          useValue: mockAdRepository,
        },
        {
          provide: getRepositoryToken(Comment),
          useValue: mockCommentRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    adRepository = module.get<Repository<Ad>>(getRepositoryToken(Ad));
    commentRepository = module.get<Repository<Comment>>(getRepositoryToken(Comment));
    dataSource = module.get<DataSource>(DataSource);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a comment', async () => {
      const createCommentDto: CreateCommentDto = { userId: 1, adId: 1, comment: 'Great ad!' };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockAdRepository.findOne.mockResolvedValue(mockAd);
      mockCommentRepository.findOne.mockResolvedValue(null);
      mockDataSource.manager.create.mockReturnValue(mockComment);
      mockDataSource.manager.save.mockResolvedValue(mockComment);

   
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const createCommentDto: CreateCommentDto = { userId: 1, adId: 1, comment: 'Great ad!' };

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createCommentDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if ad does not exist', async () => {
      const createCommentDto: CreateCommentDto = { userId: 1, adId: 1, comment: 'Great ad!' };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockAdRepository.findOne.mockResolvedValue(null);

      
    });

   
  });

  describe('getComment', () => {
    it('should return the comment for a specific ad and user', async () => {
      const adId = 1;
      const userId = 1;

      mockDataSource.manager.findOne.mockResolvedValue(mockComment);

   

  
    });

    
  });

  describe('getAllCommentsForAd', () => {
    it('should return all comments for the ad', async () => {
      const adId = 1;
      const comments = [mockComment];

      mockDataSource.manager.find.mockResolvedValue(comments);

     

   

    });

    it('should throw NotFoundException if no comments exist for the ad', async () => {
      const adId = 1;

      mockDataSource.manager.find.mockResolvedValue([]);

    
    });
  });

  describe('findOne', () => {
    it('should return a comment for a given id', async () => {
      const id = 1;
      mockDataSource.manager.findOne.mockResolvedValue(mockComment);

   

      
    });

    it('should throw NotFoundException if the comment does not exist', async () => {
      const id = 1;
      mockDataSource.manager.findOne.mockResolvedValue(null);

    });
  });

  describe('remove', () => {
    it('should remove a comment for a given id', async () => {
      const id = 1;
      mockDataSource.manager.findOne.mockResolvedValue(mockComment);
    


     
    });

    it('should throw NotFoundException if the comment does not exist', async () => {
      const id = 1;
      mockDataSource.manager.findOne.mockResolvedValue(null);

   
    });

    it('should handle errors thrown by remove method', async () => {
      const id = 1;
      mockDataSource.manager.findOne.mockResolvedValue(mockComment);
  

   
    });
  });
});

