import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { FindAllParameters, MovieRouteParameters, MoviesDto } from './movie.dto';
import { RedisService } from 'nestjs-redis';


@UseGuards(AuthGuard)
@Controller('movies')
export class MoviesController {
  constructor(
    private readonly moviesService: MoviesService,
    private readonly redisService: RedisService, 
  ) { }

  @Post()
  async registerMovie(@Body() movie: MoviesDto): Promise<MoviesDto> {
    return await this.moviesService.registerMovie(movie);
  }

  @Get('/:id')
  async findById(@Param('id') id: string): Promise<MoviesDto> {
    const client = this.redisService.getClient();
    const movieData = await client.get('movie:' + id);

    if (movieData) {
      return JSON.parse(movieData);
    } else {

      return await this.moviesService.findById(id);
    }
  }

  @Get()
  async findAll(@Query() params: any): Promise<MoviesDto[]> {
    const client = this.redisService.getClient();
    const moviesData = await client.get('movies'); 

    if (moviesData) {
      return JSON.parse(moviesData);
    } else {
      
      return await this.moviesService.findAll(params);
    }
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() movie: MoviesDto): Promise<void> {
    await this.moviesService.update(id, movie);

    const client = this.redisService.getClient();

    await client.del('movie:' + id);
  }

  @Delete('/:id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.moviesService.remove(id);

    const client = this.redisService.getClient();

    await client.del('movie:' + id);
  }
}
