import { ApiTags, ApiParam, ApiResponse, ApiBody, ApiOperation, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Param, Patch, Delete, Res, HttpStatus, NotFoundException, ForbiddenException } from '@nestjs/common';
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
        insurance:2,
        motor:"توربو",
        fuel:"گازسوز",
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
          "insurance":2,
          "motor":"توربو",
          "fuel":"گازسوز",
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
          "insurance":2,
          "motor":"توربو",
          "fuel":"گازسوز",
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
          "insurance":2,
          "motor":"توربو",
          "fuel":"گازسوز",
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
          insurance:2,
          motor:"توربو",
          fuel:"گازسوز",
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
          "insurance":2,
          "motor":"توربو",
          "fuel":"گازسوز",
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
         insurance: 2,
         motor: "توربو",
         fuel: "گازسوز",
         userId: 456
       }
     }
   }
 })
 @ApiResponse({
   status: 201,
   description: 'Ad created successfully',
   schema: {
     example: {
       id: 1,
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
       userId: 456
     }
   }
 })
 @ApiResponse({
   status: 400,
   description: 'User not found or failed to create ad',
   schema: {
     example: {
       statusCode: 400,
       message: 'User does not exist'
     }
   }
 })
 @Post()
 async create(@Body() createAdDtoPram: CreateAdDto, @Res() res: Response) {
   try {
     const result = await this.adsService.create(createAdDtoPram);
     res.status(HttpStatus.CREATED).send(result);
   } catch (e) {
     if (e instanceof NotFoundException) {
       res.status(HttpStatus.BAD_REQUEST).send({ message: 'User does not exist' });
     } else {
       res.status(HttpStatus.BAD_REQUEST).send({ message: 'Failed to create ad' });
     }
   }
 }

@ApiOperation({
  summary: 'Update an existing ad',
  description: 'Updates the details of an existing ad. The user making the request must be the owner of the ad. Pass the ad ID in the URL and the updated ad details in the request body.',
})
@ApiParam({ name: 'id', description: 'ID of the ad to be updated', type: 'number' })
@ApiBody({
  description: 'Updated details of the ad. Only provide fields that you want to update.',
  type: 'object',
  examples: {
    updateAd: {
      summary: 'Example of an update ad',
      value: {
        userId: 789,
        technicalInfo: 'اطلاعات فنی بروزرسانی شده درباره آگهی.',
        address: 'خیابان بروزرسانی شده 123',
        mobileNum: '123-456-7890',
        city: 'شهر بروزرسانی شده',
        carName: 'هیوندای اکسنت',
        picsUrl: 'http://example.com/updatedpic.jpg',
        additionalInfo: 'اطلاعات اضافی بروزرسانی شده درباره آگهی.',
        price: 11000,
        date: '2024-07-17',
        year: 2022,
        status: 1,
        model: 'مدل بروزرسانی شده',
        videoUrl: 'http://example.com/updatedvideo.mp4',
        brand: 'برند بروزرسانی شده',
        color: 'سبز',
        distance: 15000,
        accidental: false,
      },
    },
  },
})
@ApiResponse({ status: 200, description: 'Ad updated successfully' })
@ApiResponse({ status: 400, description: 'Bad request. Invalid data or update failed' })
@ApiResponse({ status: 403, description: 'User is not the owner of the ad' })
@ApiResponse({ status: 404, description: 'Ad not found' })
@Patch(':id')
async update(
  @Param('id') id: string,
  @Body() body: {
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
  },
  @Res() res: Response
) {
  try {
    // Extract userId from the request body
    const { userId, technicalInfo,address, mobileNum ,city,carName,picsUrl,additionalInfo, price,date,year,status,model,videoUrl,brand,color,distance,accidental} = body;

    // Call the service method to perform the update operation
    const updatedAd = await this.adsService.update(+id, userId,technicalInfo,address, mobileNum,city,carName,picsUrl,additionalInfo, price,date,year,status,model,videoUrl,brand,color,distance,accidental);
    
    // Send a success response with the updated ad
    res.status(HttpStatus.OK).json(updatedAd);
  } catch (error) {
    // Handle errors and send appropriate error response
    if (error instanceof ForbiddenException) {
      res.status(HttpStatus.FORBIDDEN).json({ message: error.message });
    } else if (error instanceof NotFoundException) {
      res.status(HttpStatus.NOT_FOUND).json({ message: error.message });
    } else {
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'Failed to update ad' });
    }
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
