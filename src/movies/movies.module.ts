import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesEntity } from 'src/db/entities/movies.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MoviesEntity])],
  providers: [MoviesService],
  controllers: [MoviesController]
})
export class MoviesModule {}
