import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto/create-user.dto';
import { compare } from 'bcrypt';

jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;
  let dataSource: DataSource;
  let jwtService: JwtService;

  const mockUser = {
    user_id: 1,
    email: 'test@test.com',
    password: 'password',
    name: 'Test User'
  };

  const mockUserWithoutPassword = {
    user_id: 1,
    email: 'test@test.com',
    name: 'Test User'
  };

  const mockUserRepository = {
    create: jest.fn().mockReturnValue(mockUser),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn()
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('signed-token')
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: DataSource,
          useValue: {
            manager: mockUserRepository
          }
        },
        {
          provide: JwtService,
          useValue: mockJwtService
        }
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

      const createUserDto: CreateUserDto = {
        email: 'test@test.com',
        password: 'password',
        userName: 'Test User',
        isFromGoogle:false
      };

      const result = await service.create(createUserDto);

      expect(mockUserRepository.create).toHaveBeenCalledWith(User, createUserDto);
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({ token: 'signed-token' });
    });
  });

  describe('loginUser', () => {
    it('should return user profile on successful login', async () => {
      const loginUserDto: LoginUserDto = { email: 'test@test.com', password: 'password' };
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      (compare as jest.Mock).mockResolvedValue(true);

      const result = await service.loginUser(loginUserDto);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith(User, { where: { email: loginUserDto.email } });
      expect(result).toEqual({ token: 'signed-token' });
    });

    it('should return null on failed login', async () => {
      const loginUserDto: LoginUserDto = { email: 'test@test.com', password: 'wrongpassword' };
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      (compare as jest.Mock).mockResolvedValue(false);

      const result = await service.loginUser(loginUserDto);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith(User, { where: { email: loginUserDto.email } });
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
});
