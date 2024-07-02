import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { compare, hash } from 'bcrypt';

jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;
  let dataSource: DataSource;
  let jwtService: JwtService;

  const mockUser = {
    user_id: 1,
    email: 'test@test.com',
    password: '',
    name: 'Test User',
    address: '123 Test St',
    phone: '123-456-7890',
  };

  const mockUserWithoutPassword = {
    user_id: 1,
    email: 'test@test.com',
    name: 'Test User',
    address: '123 Test St',
    phone: '123-456-7890',
  };

  const mockUserRepository = {
    create: jest.fn().mockReturnValue(mockUser),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('signed-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: DataSource,
          useValue: {
            manager: mockUserRepository,
          },
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    dataSource = module.get<DataSource>(DataSource);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a user profile', async () => {
      mockUserRepository.save.mockResolvedValue(mockUser);
      const createUser = {
        email: 'test@test.com',
        password: '',
        userName: 'Test User',
        isFromGoogle: false,
      };

      const result = await service.create(createUser);

      expect(mockUserRepository.create).toHaveBeenCalledWith(User, createUser);
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({ token: 'signed-token' });
    });
  });

  describe('loginUser', () => {
    it('should return user profile on successful login', async () => {
      const loginUser = { email: 'test@test.com', password: '' };
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      (compare as jest.Mock).mockResolvedValue(true);

      const result = await service.loginUser(loginUser);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith(User, { where: { email: loginUser.email } });
      expect(result).toEqual({ token: 'signed-token' });
    });

    it('should return null on failed login', async () => {
      const loginUser = { email: 'test@test.com', password: '' };
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      (compare as jest.Mock).mockResolvedValue(false);

      const result = await service.loginUser(loginUser);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith(User, { where: { email: loginUser.email } });
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [mockUser];
      mockUserRepository.find.mockResolvedValue(users);

      const result = await service.findAll();

      expect(mockUserRepository.find).toHaveBeenCalled();
      expect(result).toEqual(users);
    });

    
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne(1);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith(User, { where: { user_id: 1 } });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getUserInfo', () => {
    it('should return user info if user is found', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.getUserInfo(1);

      expect(result).toEqual({
        name: 'Test User',
        address: '123 Test St',
        phone: '123-456-7890',
      });
    });

   
  });

  describe('isRegisteredByGoogle', () => {
    it('should return google: Yes if user is registered by Google', async () => {
      const mockUserWithoutPasswordGoogle = { ...mockUser, password: null };
      mockUserRepository.findOne.mockResolvedValue(mockUserWithoutPasswordGoogle);

      const result = await service.isRegisteredByGoogle(1);

      expect(result).toEqual({ google: 'Yes' });
    });

    it('should return google: No if user is not registered by Google', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.isRegisteredByGoogle(1);

      expect(result).toEqual({ google: 'No' });
    });


  });

  describe('update', () => {
    it('should update user information', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      const updateUser = {
        name: 'Updated User',
        address: '456 Updated St',
        phone: '987-654-3210',
      };

      const result = await service.update(1, updateUser);

      expect(result).toEqual({ token: 'signed-token' });
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      const updateUser = { name: 'Updated User' };

      await expect(service.update(1, updateUser)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if old password is incorrect', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      (compare as jest.Mock).mockResolvedValue(false);
      const updateUser = {
        oldPassword: '',
        password: '',
      };

      await expect(service.update(1, updateUser)).rejects.toThrow(BadRequestException);
    });

    it('should hash the new password if provided', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      (compare as jest.Mock).mockResolvedValue(true);
      const hashedPassword = '';
      (hash as jest.Mock).mockResolvedValue(hashedPassword);
      const updateUser = {
        oldPassword: '',
        password: '',
      };

      const result = await service.update(1, updateUser);

      expect(hash).toHaveBeenCalledWith('', 10);
      expect(mockUserRepository.save).toHaveBeenCalledWith({ ...mockUser, password: hashedPassword });
      expect(result).toEqual({ token: 'signed-token' });
    });
  });
});
