import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FindAllParameters, MoviesDto, MoviesStatusEnum } from './movie.dto';
import { MoviesEntity } from 'src/db/entities/movies.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { RedisService } from 'nestjs-redis';

@Injectable()
export class MoviesService {

  constructor(
    @InjectRepository(MoviesEntity)
    private movieRepository: Repository<MoviesEntity>,
    private readonly redisService: RedisService,
  ) { }

  async registerMovie(movie: MoviesDto): Promise<MoviesDto> {
    const movieToSave: MoviesEntity = { 
      title: movie.title,
      director: movie.director,
      synopsis: movie.synopsis,
      genre: movie.genre,
      release: movie.release, 
    }

    const createdMovie = await this.movieRepository.save(movieToSave);

    const client = this.redisService.getClient();
    await client.set('movie:' + createdMovie.id, JSON.stringify(movie));
    
    return this.mapEntityToDto(createdMovie);
  }

  async findById(id: string): Promise<MoviesDto> {
    const client = this.redisService.getClient();
    const movieData = await client.get('movie:' + id);

    if (movieData) {
      return JSON.parse(movieData);
    } else {
      const foundMovie = await this.movieRepository.findOne({ where: { id } });

      if (!foundMovie) {
        throw new HttpException(
          `Movie with id ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return this.mapEntityToDto(foundMovie);
    }
  }

  async findAll(params: FindAllParameters): Promise<MoviesDto[]> {
    const searchPrams: FindOptionsWhere<MoviesEntity> = {}

    if (params.title) {
      searchPrams.title = Like(`%${params.title}%`);
    }

    if (params.genre) {
      searchPrams.genre = Like(`%${params.genre}%`);
    }

    const moviesFound = await this.movieRepository.find({
      where: searchPrams
    });

    const client = this.redisService.getClient();
    await client.set('movies', JSON.stringify(moviesFound));

    return moviesFound.map(taskEntity => this.mapEntityToDto(taskEntity));
  }

  async update(id: string, movie: MoviesDto) {
    const foundMovie = await this.movieRepository.findOne({ where: { id } })

    if (!foundMovie) {
      throw new HttpException(
        `Movie with id '${id}' not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const client = this.redisService.getClient();
    await client.del('movie:' + id);

    await this.movieRepository.update(id, this.mapDtoToEntity(movie));
  }

  async remove(id: string) {

    const result = await this.movieRepository.delete(id)

    if (!result.affected) {
      throw new HttpException(
        `Movie with id '${id}' not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const client = this.redisService.getClient();
    await client.del('movie:' + id);

  }

  private mapEntityToDto(movieEntity: MoviesEntity): MoviesDto {
    return {
      id: movieEntity.id,
      title: movieEntity.title,
      director: movieEntity.director,
      synopsis: movieEntity.synopsis,
      genre: MoviesStatusEnum[movieEntity.genre],
      release: movieEntity.release,
    }
  }

  private mapDtoToEntity(moviesDto: MoviesDto): Partial<MoviesEntity> {
    return {
      title: moviesDto.title,
      director: moviesDto.director,
      synopsis: moviesDto.synopsis,
      genre: moviesDto.genre.toString(),
      release: moviesDto.release,
    }
  }
}
