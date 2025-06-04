import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Movie } from '../movie/entities/movie.entity';
import { MovieModule } from '../movie/movie.module';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Movie]), MovieModule],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
