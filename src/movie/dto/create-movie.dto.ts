import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
} from 'class-validator';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsInt()
  @IsNotEmpty()
  @Max(new Date().getFullYear())
  releaseYear: number;

  @IsBoolean()
  @IsOptional()
  isAvailable: boolean;
}
