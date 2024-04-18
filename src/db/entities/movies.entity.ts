import { Entity, Column, PrimaryGeneratedColumn, IntegerType } from 'typeorm';

@Entity({ name: 'movies' })
export class MoviesEntity {
    @PrimaryGeneratedColumn('uuid')
    id?: string;
  
    @Column({ type: 'varchar' })
    title: string;
  
    @Column({ type: 'varchar' })
    director: string;
  
    @Column({ type: 'varchar' })
    synopsis: string;
  
    @Column({ type: 'varchar' })
    genre: string;
  
    @Column({ type: 'integer' })
    release: IntegerType;
}
