import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindManyOptions,DataSource } from 'typeorm'; // Importing necessary modules
import { Ad } from './entities/ads.entity'; // Importing the Ad entity
import { CreateAdDto } from './dto/create-ads.dto'; // Importing the CreateAdDto

@Injectable()
export class AdsService {
  constructor(
    @InjectRepository(Ad)
    private readonly adRepository: Repository<Ad>, private dataSource: DataSource// Injecting the Ad repository
  ) {}

  // Method to create a new ad
  async create(adDto: CreateAdDto) {
    const newAd = this.dataSource.manager.create(Ad,adDto);
    await this.dataSource.manager.save(newAd);
    return "Ad created successfully "; 
  }
  
  // Method to find all ads associated with a specific user
  async findByUserId(userId: number) {
    const ads = await this.dataSource.manager.find(Ad,{ where: { userId:userId }  });
    if (!ads.length) {
      throw new NotFoundException(`No ads found for user with ID ${userId}`);
    }
    return ads;
  }

  // Method to find an ad by its ID
  async findOne(id: number) {
    
    const ad = await this.dataSource.manager.findOne(Ad,{ where: { adId:id} } ); // Finding the ad by ID
    if (!ad) {
      throw new NotFoundException('Ad not found'); // Throwing an error if the ad is not found
    }
    return ad; // Returning the found ad
  }


  // Method to find all ads
  async findAll() {

    const ad = await this.dataSource.manager.find(Ad ); 
    if (!ad) {
      throw new NotFoundException('No ads available'); // Throwing an error if the ad is not found
    }
    return ad; // Returning the found ads
    
  }

  // Method to update an ad
  async update(id: number, adDto: CreateAdDto) {
    const existingAd = await this.findOne(id); // Finding the existing ad by ID
    const updatedAd = { ...existingAd, ...adDto }; // Merging the existing ad with the updated data
    //return this.adRepository.save(updatedAd); // Saving the updated ad to the database
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

   


}
