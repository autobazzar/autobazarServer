import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindManyOptions } from 'typeorm'; // Importing necessary modules
import { Ad } from './entities/ads.entity'; // Importing the Ad entity
import { CreateAdDto } from './dto/create-ads.dto'; // Importing the CreateAdDto

@Injectable()
export class AdsService {
  constructor(
    @InjectRepository(Ad)
    private readonly adRepository: Repository<Ad>, // Injecting the Ad repository
  ) {}

  // Method to create a new ad
  async create(adDto: CreateAdDto): Promise<Ad> {
    const ad = this.adRepository.create(adDto); 
    return this.adRepository.save(ad); 
  }
  // Method to find all ads associated with a specific user
  async findByUserId(userId: number): Promise<Ad[]> {
    const ads = await this.adRepository.find({ where: { userId } as any });
    if (!ads.length) {
      throw new NotFoundException(`No ads found for user with ID ${userId}`);
    }
    return ads;
  }

  // Method to find an ad by its ID
  async findOne(id: number): Promise<Ad> {
    const ad = await this.adRepository.findOne({ where: { id } } as any); // Finding the ad by ID
    if (!ad) {
      throw new NotFoundException('Ad not found'); // Throwing an error if the ad is not found
    }
    return ad; // Returning the found ad
  }


  // Method to find all ads
  async findAll(): Promise<Ad[]> {
    return this.adRepository.find(); // Finding all ads in the database
  }

  // Method to update an ad
  async update(id: number, adDto: CreateAdDto): Promise<Ad> {
    const existingAd = await this.findOne(id); // Finding the existing ad by ID
    const updatedAd = { ...existingAd, ...adDto }; // Merging the existing ad with the updated data
    return this.adRepository.save(updatedAd); // Saving the updated ad to the database
  }

  // Method to remove an ad
  async remove(id: number): Promise<void> {
    await this.adRepository.delete(id); // Deleting the ad from the database
  }

  // Method to change the status of an ad
  async changeStatus(id: number, status: number): Promise<void> {
    const ad = await this.findOne(id); // Finding the ad by ID
    ad.status = status; // Changing the status of the ad
    await this.adRepository.save(ad); // Saving the updated ad to the database
  }

    // Method to get all ads associated with a specific user
    async getUserAds(userId: number): Promise<Ad[]> {
        return this.adRepository.find({ where: { userId }as any }); // Finding all ads associated with the specified user
      }

  // Method to search ads based on a query string
  async searchAds(query: string): Promise<Ad[]> {
    const fieldsToSearch = ['technicalInfo', 'address', 'city', 'carName', 'additionalInfo', 'model', 'brand', 'color']; // Fields to search in
    const conditions: FindManyOptions<Ad> = {}; // Options for the search query

    // Constructing the query dynamically for each field
    fieldsToSearch.forEach(field => {
      conditions.where = { ...conditions.where, [field]: Like(`%${query}%`) }; // Using the Like operator to perform a case-insensitive search
    });

    // Finding ads that match any of the search criteria
    return this.adRepository.find(conditions);
  }
}
