import { ApiTags, ApiParam, ApiResponse, ApiBody, ApiOperation } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Param, Patch, Delete, Res, HttpStatus, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AdsService } from './ads.service';
import { CreateAdDto, UpdateAdDto } from './dto/create-ads.dto';
import { Response } from 'express';



@ApiTags('ads') // Tagging the controller with 'ads' for Swagger documentation
@Controller('ads') // Controller responsible for handling requests related to ads
export class AdsController {
  constructor(private readonly adsService: AdsService) {} // Injecting the AdsService


  // GET request to find an ad by its ID
  @ApiOperation({ summary: 'Find ad by ID' })
  @ApiParam({ name: 'id', description: 'Ad ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Found ad', type: CreateAdDto })
  @ApiResponse({ status: 404, description: 'Ad not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adsService.findOne(+id); // Calling the service method to find an ad by ID
  }


  // GET request to find an ad by its ID
  @ApiOperation({ summary: 'All ads' })
  
  @ApiResponse({ status: 200, description: 'Found ads', type: CreateAdDto })
  @ApiResponse({ status: 404, description: 'Not available ads' })
  @Get('')
  findAll() {
    return this.adsService.findAll(); 
  }

  

  // GET request to find ads associated with a specific user
  @ApiOperation({ summary: 'Find ads by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Found ads', type: CreateAdDto, isArray: true })
  @ApiResponse({ status: 404, description: 'No ads found for user' })
  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.adsService.findByUserId(+userId); // Calling the service method to find ads by user ID
  }

  

// POST request to create a new ad
@ApiOperation({ summary: 'Create a new ad' })
@ApiBody({ type: CreateAdDto })
@ApiResponse({ status: 201, description: 'Ad created successfully', type: CreateAdDto })
@ApiResponse({ status: 400, description: 'Failed to create ad' })
@Post()
//@UseInterceptors(FilesInterceptor('pictures', 10), FilesInterceptor('videos', 5)) // Handle file uploads for pictures and videos
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
  @ApiBody({ type: UpdateAdDto })
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