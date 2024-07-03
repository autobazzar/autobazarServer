import { IsInt, IsNotEmpty } from 'class-validator';

// DTO for creating a rate
export class CreateCommentDto {
  
  @IsNotEmpty() // Ensure comment is provided 
  comment: string;

  @IsInt()
  @IsNotEmpty() // Ensure userId is provided
  userId: number;

  @IsInt()
  @IsNotEmpty() // Ensure adId is provided
  adId: number;

  score?: number;
}
