import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MovieModule } from './movie/movie.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ReviewModule } from './review/review.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
      }),
      envFilePath: '.env',
      isGlobal: true,
    }),
    MovieModule,
    DatabaseModule,
    ReviewModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
