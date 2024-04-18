import {
    IsDateString,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    MaxLength,
    MinLength,
  } from 'class-validator';
import { IntegerType } from 'typeorm';
  
  export enum MoviesStatusEnum {
    Action = 'Action',
    Adventure = 'Adventure',
    Comedy = 'Comedy',
    Drama = 'Drama',
    Fantasy = 'Fantasy',
    Horror = 'Horror',
    Mystery = 'Mystery',
    Romance = 'Romance',
    SciFi = 'Science Fiction',
    Thriller = 'Thriller',
    Western = 'Western',
  }

  export class MoviesDto {
    @IsUUID()
    @IsOptional()
    id: string;
  
    @IsString()
    @MinLength(3)
    @MaxLength(256)
    title: string;

    @IsString()
    @MinLength(3)
    @MaxLength(256)
    director: string;


  
    @IsString()
    @MinLength(5)
    @MaxLength(512)
    synopsis: string;
  
    @IsEnum(MoviesStatusEnum)
    @IsOptional()
    genre: MoviesStatusEnum;
  
    @IsNumber()
    release: IntegerType;

  }
  
  export interface FindAllParameters {
    title: string;
    genre: string;
  }
  
  export class MovieRouteParameters {
    @IsUUID()
    id: string;
  }


