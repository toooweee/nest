import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { Repository } from 'typeorm';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Review } from '../review/entities/review.entity';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly moviesRepository: Repository<Movie>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const movie = this.moviesRepository.create(createMovieDto);
    await this.moviesRepository.save(movie);
    return movie;
  }

  async findAll() {
    const movies = await this.moviesRepository.find();

    return movies.map(async (movie) => {
      const reviews = await this.reviewRepository.find({
        where: {
          movieId: movie.id,
        },
      });

      let averageRating = 0;

      return {
        ...movie,
        rating: averageRating,
      };
    });
  }

  async findOne(id: string) {
    const movie = await this.moviesRepository.findOne({
      where: {
        id,
      },
    });

    if (!movie) {
      throw new NotFoundException(`Movie with id ${id} not found`);
    }

    return movie;
  }

  async update(id: string, updateMovieDto: UpdateMovieDto) {
    await this.findOne(id);

    return await this.moviesRepository.update(id, updateMovieDto);
  }

  async delete(id: string) {
    await this.findOne(id);

    return await this.moviesRepository.delete(id);
  }
}
