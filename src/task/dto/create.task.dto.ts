import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Length,
  Matches,
} from 'class-validator';
import { Tags } from '../types/tags.enum';

export class CreateTaskDto {
  @IsString({ message: 'Task must be a string' })
  @Length(4, 20)
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsPositive()
  @IsInt()
  priority: number;

  @IsArray()
  @IsEnum(Tags, { each: true })
  @IsOptional()
  tags: Tags[];

  // @Matches(/^(?=.*[A-Z])(?=.*[0-9]).+$/)
  // password: string;
  //
  // @IsUrl({ protocols: ['http', 'https'], require_port: true })
  // websiteUrl: string;
}
