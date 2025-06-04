import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { MovieService } from '../movie/movie.service';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly movieService: MovieService,
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    await this.movieService.findOne(createReviewDto.movieId);
    const review = this.reviewRepository.create({
      ...createReviewDto,
    });
    return await this.reviewRepository.save(review);
  }
}
