import { ApiTags, ApiParam, ApiResponse, ApiBody, ApiOperation, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Param, Patch, Delete, Res, HttpStatus } from '@nestjs/common';
import { AdsService } from './ads.service';
import { CreateAdDto, UpdateAdDto } from './dto/create-ads.dto';
import { Response } from 'express';

@ApiTags('ads') // Tagging the controller with 'ads' for Swagger documentation
@ApiExtraModels(CreateAdDto, UpdateAdDto) // Including models for extra documentation
@Controller('ads') // Controller responsible for handling requests related to ads
export class AdsController {
  constructor(private readonly adsService: AdsService) {} // Injecting the AdsService

  // GET request to find an ad by its ID
  @ApiOperation({ summary: 'Find ad by ID' })
  @ApiParam({ name: 'id', description: 'Ad ID', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Found ad',
    schema: {
      type: 'object',
      $ref: getSchemaPath(CreateAdDto),
      example: {
        adId: 1,
        technicalInfo: "اطلاعات فنی مثال درباره آگهی.",
        address: "خیابان مثال 123",
        mobileNum: "123-456-7890",
        city: "شهر مثال",
        carName: "تویوتا کمری",
        picsUrl: "https://dl4.fara-download.ir/imgfa/2020/10/26/imgfa_ir__5f96e123beaaf_1.jpg",
        additionalInfo: "اطلاعات اضافی مثال درباره آگهی.",
        price: 10000,
        date: "2024-05-17",
        year: 2021,
        status: 1,
        model: "مدل مثال",
        videoUrl: "http://example.com/video.mp4",
        brand: "برند مثال",
        color: "قرمز",
        distance: 50000,
        accidental: false,
        userId: 123
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Ad not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adsService.findOne(+id); // Calling the service method to find an ad by ID
  }

  // GET request to find all ads
  @ApiOperation({ summary: 'All ads' })
  @ApiResponse({
    status: 200,
    description: 'Found ads',
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(CreateAdDto) },
      example: [
        {
          "adId": 1,
          "technicalInfo": "اطلاعات فنی مثال درباره آگهی.",
          "address": "خیابان مثال 123",
          "mobileNum": "123-456-7890",
          "city": "شهر مثال",
          "carName": "تویوتا کمری",
          "picsUrl": "https://dl4.fara-download.ir/imgfa/2020/10/26/imgfa_ir__5f96e123beaaf_1.jpg",
          "additionalInfo": "اطلاعات اضافی مثال درباره آگهی.",
          "price": 10000,
          "date": "2024-05-17",
          "year": 2021,
          "status": 1,
          "model": "مدل مثال",
          "videoUrl": "http://example.com/video.mp4",
          "brand": "برند مثال",
          "color": "قرمز",
          "distance": 50000,
          "accidental": false,
          "userId": 123
        },
        {
          "adId": 2,
          "technicalInfo": "اطلاعات فنی مثال درباره آگهی.",
          "address": "خیابان مثال 123",
          "mobileNum": "123-456-7890",
          "city": "شهر مثال",
          "carName": "تویوتا کمری",
          "picsUrl": "https://dl4.fara-download.ir/imgfa/2020/10/31/q_imgfa_ir__5f9d86b0e0474_1.jpg",
          "additionalInfo": "اطلاعات اضافی مثال درباره آگهی.",
          "price": 10000,
          "date": "2024-05-17",
          "year": 2021,
          "status": 1,
          "model": "مدل مثال",
          "videoUrl": "https://dl4.fara-download.ir/imgfa/2020/10/28/q_imgfa_ir__5f9927fbc3a48_1.jpg",
          "brand": "برند مثال",
          "color": "قرمز",
          "distance": 50000,
          "accidental": false,
          "userId": 123
        },
        {
          "adId": 3,
          "technicalInfo": "اطلاعات فنی مثال درباره آگهی.",
          "address": "خیابان مثال 456",
          "mobileNum": "987-654-3210",
          "city": "شهر مثال",
          "carName": "هیوندای سانتافه",
          "picsUrl": "https://dl4.fara-download.ir/imgfa/2020/10/26/imgfa_ir__5f96e123beaaf_1.jpg",
          "additionalInfo": "اطلاعات اضافی مثال درباره آگهی.",
          "price": 15000,
          "date": "2024-05-17",
          "year": 2022,
          "status": 1,
          "model": "مدل مثال",
          "videoUrl": "http://example.com/video2.mp4",
          "brand": "برند مثال",
          "color": "آبی",
          "distance": 30000,
          "accidental": false,
          "userId": 456
        }
      ]
    }
  })
  @ApiResponse({ status: 404, description: 'No ads available' })
  @Get('')
  findAll() {
    return this.adsService.findAll(); 
  }

  // GET request to find ads associated with a specific user
  @ApiOperation({ summary: 'Find ads by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Found ads',
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(CreateAdDto) },
      example: [
        {
          adId: 1,
          technicalInfo: "اطلاعات فنی مثال درباره آگهی.",
          address: "خیابان مثال 123",
          mobileNum: "123-456-7890",
          city: "شهر مثال",
          carName: "تویوتا کمری",
          picsUrl: "https://dl4.fara-download.ir/imgfa/2020/10/26/imgfa_ir__5f96e123beaaf_1.jpg",
          additionalInfo: "اطلاعات اضافی مثال درباره آگهی.",
          price: 10000,
          date: "2024-05-17",
          year: 2021,
          status: 1,
          model: "مدل مثال",
          videoUrl: "http://example.com/video.mp4",
          brand: "برند مثال",
          color: "قرمز",
          distance: 50000,
          accidental: false,
          userId: 123
        },
        {
          "adId": 2,
          "technicalInfo": "اطلاعات فنی مثال درباره آگهی.",
          "address": "خیابان مثال 123",
          "mobileNum": "123-456-7890",
          "city": "شهر مثال",
          "carName": "تویوتا کمری",
          "picsUrl": "https://dl4.fara-download.ir/imgfa/2020/10/31/q_imgfa_ir__5f9d86b0e0474_1.jpg",
          "additionalInfo": "اطلاعات اضافی مثال درباره آگهی.",
          "price": 10000,
          "date": "2024-05-17",
          "year": 2021,
          "status": 1,
          "model": "مدل مثال",
          "videoUrl": "https://dl4.fara-download.ir/imgfa/2020/10/28/q_imgfa_ir__5f9927fbc3a48_1.jpg",
          "brand": "برند مثال",
          "color": "قرمز",
          "distance": 50000,
          "accidental": false,
          "userId": 123
        }
      ]
    }
  })
  @ApiResponse({ status: 404, description: 'No ads found for user' })
  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.adsService.findByUserId(+userId); // Calling the service method to find ads by user ID
  }

  // POST request to create a new ad
  @ApiOperation({ summary: 'Create a new ad' })
  @ApiBody({
    type: CreateAdDto,
    examples: {
      newAd: {
        summary: 'Example of a new ad',
        value: {
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
          userId: 456
        }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Ad created successfully', type: CreateAdDto })
  @ApiResponse({ status: 400, description: 'Failed to create ad' })
  @Post()
  async create(
    @Body() createAdDtoPram: CreateAdDto,
    @Res() res: Response
  ) {
    try {
      const result = await this.adsService.create(createAdDtoPram);
      res.status(HttpStatus.OK).send(result);
    } catch (e) {
      res.status(HttpStatus.BAD_REQUEST).send({ message: 'Failed to create ad' }); // Sending error response if creation fails
    }
  }

  // PATCH request to update an existing ad
  @ApiOperation({ summary: 'Update an existing ad' })
  @ApiParam({ name: 'id', description: 'Ad ID', type: 'number' })
  @ApiBody({
    type: UpdateAdDto,
    examples: {
      updateAd: {
        summary: 'Example of an update ad',
        value: {
          technicalInfo: "اطلاعات فنی بروزرسانی شده درباره آگهی.",
          address: "خیابان بروزرسانی شده 123",
          mobileNum: "123-456-7890",
          city: "شهر بروزرسانی شده",
          carName: "هیوندای اکسنت",
          picsUrl: "http://example.com/updatedpic.jpg",
          additionalInfo: "اطلاعات اضافی بروزرسانی شده درباره آگهی.",
          price: 11000,
          date: "2024-07-17",
          year: 2022,
          status: 1,
          model: "مدل بروزرسانی شده",
          videoUrl: "http://example.com/updatedvideo.mp4",
          brand: "برند بروزرسانی شده",
          color: "سبز",
          distance: 15000,
          accidental: false,
          userId: 789
        }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Ad updated successfully', type: UpdateAdDto })
  @ApiResponse({ status: 400, description: 'Failed to update ad' })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateAdDto: UpdateAdDto, @Res() res: Response) {
    try {
      const result = await this.adsService.update(+id, updateAdDto); // Updating an existing ad using the provided DTO
      res.status(HttpStatus.OK).send(result); // Sending success response with the updated ad
    } catch (e) {
      res.status(HttpStatus.BAD_REQUEST).send({ message: 'Failed to update ad' }); // Sending error response if update fails
    }
  }

  // DELETE request to remove an existing ad
  @ApiOperation({ summary: 'Delete an existing ad' })
  @ApiParam({ name: 'id', description: 'Ad ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Ad deleted successfully' })
  @ApiResponse({ status: 400, description: 'Failed to delete ad' })
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.adsService.remove(+id); // Removing an ad by its ID
      res.status(HttpStatus.OK).send({ message: 'Ad deleted successfully' }); // Sending success response
    } catch (e) {
      res.status(HttpStatus.BAD_REQUEST).send({ message: 'Failed to delete ad' }); // Sending error response if deletion fails
    }
  }

  // PATCH request to change the status of an ad
  @ApiOperation({ summary: 'Change ad status' })
  @ApiParam({ name: 'id', description: 'Ad ID', type: 'number' })
  @ApiBody({ type: Number })
  @ApiResponse({ status: 200, description: 'Ad status changed successfully' })
  @ApiResponse({ status: 400, description: 'Failed to change ad status' })
  @Patch(':id/status')
  async changeStatus(@Param('id') id: string, @Body('status') status: number, @Res() res: Response) {
    try {
      await this.adsService.changeStatus(+id, status); // Changing the status of an ad by its ID
      res.status(HttpStatus.OK).send({ message: 'Ad status changed successfully' }); // Sending success response
    } catch (e) {
      res.status(HttpStatus.BAD_REQUEST).send({ message: 'Failed to change ad status' }); // Sending error response if status change fails
    }
  }
}
