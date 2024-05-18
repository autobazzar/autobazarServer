import { IsNotEmpty, IsString, IsUrl, IsOptional, IsBoolean, IsNumber, IsInt } from 'class-validator';

// DTO for creating an ad
export class CreateAdDto {
  @IsString() @IsNotEmpty()
  technicalInfo: string; // Technical information about the ad

  @IsString() @IsNotEmpty()
  address: string; // Address of the ad

  @IsString() @IsNotEmpty()
  mobileNum: string; // Mobile number associated with the ad

  @IsString() @IsNotEmpty()
  city: string; // City of the ad

  @IsString() @IsNotEmpty()
  carName: string; // Name of the car in the ad

  @IsString() @IsNotEmpty() @IsUrl()
  picsUrl: string; // URL of the pictures associated with the ad

  @IsOptional() @IsString()
  additionalInfo?: string; // Additional information about the ad

  @IsNumber() @IsNotEmpty()
  price: number; // Price of the ad

  @IsNotEmpty()
  date: string; // Date of the ad

  @IsNumber() @IsInt()
  year: number; // Year of the car in the ad

  @IsNumber() @IsInt()
  status: number; // Status of the ad

  @IsString() @IsNotEmpty()
  model: string; // Model of the car in the ad

  @IsOptional() @IsString() @IsUrl()
  videoUrl?: string; // URL of the video associated with the ad

  @IsString() @IsNotEmpty()
  brand: string; // Brand of the car in the ad

  @IsString() @IsNotEmpty()
  color: string; // Color of the car in the ad

  @IsOptional() @IsNumber() @IsInt()
  distance?: number; // Distance of the car in the ad

  @IsOptional() @IsBoolean()
  accidental?: boolean; // Indicates if the car has been in an accident

  @IsNumber() @IsNotEmpty()
  userId: number; // ID of the user associated with the ad
}

// DTO for updating an ad
export class UpdateAdDto {
  @IsString() @IsNotEmpty()
  technicalInfo: string; // Technical information about the ad

  @IsString() @IsNotEmpty()
  address: string; // Address of the ad

  @IsString() @IsNotEmpty()
  mobileNum: string; // Mobile number associated with the ad

  @IsString() @IsNotEmpty()
  city: string; // City of the ad

  @IsString() @IsNotEmpty()
  carName: string; // Name of the car in the ad

  @IsString() @IsNotEmpty() @IsUrl()
  picsUrl: string; // URL of the pictures associated with the ad

  @IsString()
  additionalInfo?: string; // Additional information about the ad

  @IsNumber() @IsNotEmpty()
  price: number; // Price of the ad

  @IsNotEmpty()
  date: string; // Date of the ad

  @IsNumber() @IsInt()
  year: number; // Year of the car in the ad

  @IsNumber() @IsInt()
  status: number; // Status of the ad

  @IsString() @IsNotEmpty()
  model: string; // Model of the car in the ad

  @IsString() @IsUrl()
  videoUrl?: string; // URL of the video associated with the ad

  @IsString() @IsNotEmpty()
  brand: string; // Brand of the car in the ad

  @IsString() @IsNotEmpty()
  color: string; // Color of the car in the ad

  @IsNumber() @IsInt()
  distance?: number; // Distance of the car in the ad

  @IsNumber() @IsNotEmpty()
  userId: number; // ID of the user associated with the ad
  
  @IsBoolean()
  accidental?: boolean; // Indicates if the car has been in an accident


}