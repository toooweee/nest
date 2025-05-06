import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MovieModule } from './movie/movie.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: 'postgres',
      database: 'nestjs',
      autoLoadEntities: true,
      synchronize: true,
    }),
    MovieModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
