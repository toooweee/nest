import { IsInt, IsNotEmpty, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsInt()
  @Min(0)
  @Max(10)
  @IsNotEmpty()
  rating: number;

  @IsUUID('4')
  @IsNotEmpty()
  movieId: string;
}
