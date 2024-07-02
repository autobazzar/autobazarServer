import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Ad } from './entities/ads.entity';
import { User } from '../users/entities/user.entity';
import { CreateAdDto, UpdateAdDto } from './dto/create-ads.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('ads')
@Injectable()
export class AdsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private dataSource: DataSource
  ) {}

  @ApiOperation({ summary: 'Create a new ad' })
  @ApiResponse({ status: 201, description: 'Ad created successfully' })
  @ApiResponse({ status: 404, description: 'User does not exist' })
  @ApiBody({ type: CreateAdDto, description: 'Details of the ad to be created' })
  async create(adDto: CreateAdDto) {
    const { userId } = adDto;

    const userExists = await this.userRepository.findOne({ where: { user_id: userId } });
    if (!userExists) {
      throw new NotFoundException('User does not exist');
    }

    const newAd = this.dataSource.manager.create(Ad, adDto);
    await this.dataSource.manager.save(newAd);
    return 'Ad created successfully';
  }

  @ApiOperation({ summary: 'Find all ads associated with a specific user' })
  @ApiResponse({ status: 200, description: 'Ads retrieved successfully', type: [Ad] })
  @ApiResponse({ status: 404, description: 'No ads found for user with ID {userId}' })
  @ApiParam({ name: 'userId', required: true, description: 'ID of the user whose ads are to be retrieved' })
  async findByUserId(userId: number) {
    const ads = await this.dataSource.manager.find(Ad, { where: { userId: userId } });
    if (!ads.length) {
      throw new NotFoundException(`No ads found for user with ID ${userId}`);
    }
    return ads;
  }

  @ApiOperation({ summary: 'Find an ad by its ID' })
  @ApiResponse({ status: 200, description: 'Ad retrieved successfully', type: Ad })
  @ApiResponse({ status: 404, description: 'Ad not found' })
  @ApiParam({ name: 'id', required: true, description: 'ID of the ad to be retrieved' })
  async findOne(id: number) {
    const ad = await this.dataSource.manager.findOne(Ad, { where: { adId: id } });
    if (!ad) {
      throw new NotFoundException('Ad not found');
    }
    return ad;
  }

  @ApiOperation({ summary: 'Find all ads' })
  @ApiResponse({ status: 200, description: 'Ads retrieved successfully', type: [Ad] })
  @ApiResponse({ status: 404, description: 'No ads available' })
  async findAll() {
    const ad = await this.dataSource.manager.find(Ad);
    if (!ad.length) {
      throw new NotFoundException('No ads available');
    }
    return ad;
  }

  @ApiOperation({ summary: 'Update an ad' })
  @ApiResponse({ status: 200, description: 'Ad updated successfully', type: Ad })
  @ApiResponse({ status: 404, description: 'Ad not found' })
  @ApiResponse({ status: 403, description: 'User is not the owner of the ad' })
  @ApiParam({ name: 'id', required: true, description: 'ID of the ad to be updated' })
  @ApiBody({ schema: {
    type: 'object',
    properties: {
      technicalInfo: { type: 'string', description: 'Updated technical information' },
      address: { type: 'string', description: 'Updated address' },
      mobileNum: { type: 'string', description: 'Updated mobile number' },
      city: { type: 'string', description: 'Updated city' },
      carName: { type: 'string', description: 'Updated car name' },
      picsUrl: { type: 'string', description: 'Updated pictures URL' },
      additionalInfo: { type: 'string', description: 'Updated additional information' },
      price: { type: 'number', description: 'Updated price' },
      date: { type: 'string', description: 'Updated date' },
      year: { type: 'number', description: 'Updated year' },
      status: { type: 'number', description: 'Updated status' },
      model: { type: 'string', description: 'Updated model' },
      videoUrl: { type: 'string', description: 'Updated video URL' },
      brand: { type: 'string', description: 'Updated brand' },
      color: { type: 'string', description: 'Updated color' },
      distance: { type: 'number', description: 'Updated distance' },
      accidental: { type: 'boolean', description: 'Updated accidental status' },
      userId: { type: 'number', description: 'ID of the user making the update' }
    }
  } })
  async update(
    id: number,
    userId: number,
    technicalInfo?: string,
    address?: string,
    mobileNum?: string,
    city?: string,
    carName?: string,
    picsUrl?: string,
    additionalInfo?: string,
    price?: number,
    date?: string,
    year?: number,
    status?: number,
    model?: string,
    videoUrl?: string,
    brand?: string,
    color?: string,
    distance?: number,
    accidental?: boolean
  ): Promise<Ad> {
    const existingAd = await this.findOne(id);

    // Check if the user making the update is the owner of the ad
    if (existingAd.userId !== userId) {
      throw new NotFoundException('User is not the owner of the ad');
    }


    // Check if the user making the update is the owner of the ad
    if (existingAd.userId !== userId) {
      throw new ForbiddenException('User is not the owner of the ad');
    }

    // Update fields if they are provided
    if (technicalInfo !== undefined) existingAd.technicalInfo = technicalInfo;
   
    if (address !== undefined) existingAd.address = address;
    if (mobileNum !== undefined) existingAd.mobileNum = mobileNum;
    if (city !== undefined) existingAd.city = city;
    if (carName !== undefined) existingAd.carName = carName;
    if (picsUrl !== undefined) existingAd.picsUrl = picsUrl;
    if (additionalInfo !== undefined) existingAd.additionalInfo = additionalInfo;
    if (price !== undefined) existingAd.price = price;
    if (date !== undefined) existingAd.date = date;
    if (year !== undefined) existingAd.year = year;
    if (status !== undefined) existingAd.status = status;
    if (model !== undefined) existingAd.model = model;
    if (videoUrl !== undefined) existingAd.videoUrl = videoUrl;
    if (brand !== undefined) existingAd.brand = brand;
    if (color !== undefined) existingAd.color = color;
    if (distance !== undefined) existingAd.distance = distance;
    if (accidental !== undefined) existingAd.accidental = accidental;

    // Save the updated ad to the database
    return this.dataSource.manager.save(existingAd);
  }


  @ApiOperation({ summary: 'Remove an ad' })
  @ApiResponse({ status: 200, description: 'Ad removed successfully' })
  @ApiResponse({ status: 404, description: 'Ad not found' })
  @ApiParam({ name: 'id', required: true, description: 'ID of the ad to be removed' })
  async remove(id: number): Promise<void> {
    try {
      const ad = await this.findOne(id);
      await this.dataSource.manager.remove(Ad, ad);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Ad not found');
      }
    }
  }

  @ApiOperation({ summary: 'Change the status of an ad' })
  @ApiResponse({ status: 200, description: 'Ad status changed successfully' })
  @ApiResponse({ status: 404, description: 'Ad not found' })
  @ApiParam({ name: 'id', required: true, description: 'ID of the ad whose status is to be changed' })
  @ApiBody({ schema: { type: 'object', properties: { status: { type: 'number', description: 'New status of the ad' } } } })
  async changeStatus(id: number, status: number): Promise<void> {
    const ad = await this.findOne(id);
    ad.status = status;
    await this.dataSource.manager.save(ad);
  }
}
