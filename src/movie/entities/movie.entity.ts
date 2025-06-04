import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Review } from '../../review/entities/review.entity';

export enum Genre {
  ACTION = 'action',
  COMEDY = 'comedy',
  DRAMA = 'drama',
  HORROR = 'horror',
}

@Entity({ name: 'movies' })
export class Movie {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({
    name: 'release_year',
  })
  releaseYear: number;

  @Column({
    type: 'decimal',
    precision: 3,
    scale: 1,
    default: 0.0,
  })
  rating: number;

  @Column({
    name: 'is_available',
    type: 'boolean',
    default: false,
  })
  isAvailable: boolean;

  @Column({
    type: 'enum',
    enum: Genre,
    default: Genre.DRAMA,
  })
  genre: Genre;

  @OneToMany(() => Review, (review) => review.movie)
  reviews: Review[];

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
