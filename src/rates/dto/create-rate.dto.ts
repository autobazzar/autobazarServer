import { IsInt, IsIn, IsNotEmpty } from 'class-validator';

// DTO for creating a rate
export class CreateRateDto {
  @IsInt()
  @IsIn([1, 2, 3, 4, 5])
  @IsNotEmpty() // Ensure score is provided and within the range of 1 to 5
  score: number;

  @IsInt()
  @IsNotEmpty() // Ensure userId is provided
  userId: number;

  @IsInt()
  @IsNotEmpty() // Ensure adId is provided
  adId: number;
}
