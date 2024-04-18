import { Module} from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './db/db.module';
import { MoviesModule } from './movies/movies.module';
import { RedisModule } from 'nestjs-redis';


@Module({
  imports: [ RedisModule.forRoot({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379, 
    password: process.env.REDIS_PASSWORD || null, 
    db: parseInt(process.env.REDIS_DB, 10) || 0, 
  }),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    DbModule,
    MoviesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
