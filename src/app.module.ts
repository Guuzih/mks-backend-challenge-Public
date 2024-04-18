import { Module} from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DbModule } from './db/db.module';
import { MoviesModule } from './movies/movies.module';
import { RedisModule, RedisModuleOptions } from 'nestjs-redis';


@Module({
  imports: [ RedisModule.forRootAsync({
    useFactory: (configService: ConfigService) => {
      const redisConfig: RedisModuleOptions = {
        host: configService.get('REDIS_HOST') || 'localhost',
        port: configService.get<number>('REDIS_PORT') || 6379,
        password: configService.get('REDIS_PASSWORD') || null,
        db: configService.get<number>('REDIS_DB') || 0,
      };
      return redisConfig;
    },
    inject: [ConfigService],
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
