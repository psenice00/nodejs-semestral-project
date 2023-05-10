import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/users.module';
import { BlogModule } from './blogs/blogs.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users/database/user.entity';
import { BlogEntity } from './blogs/database/blog.entity';
import { CommentModule } from './comments/comments.module';
import { CommentEntity } from './comments/database/comment.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [BlogEntity, CommentEntity, UserEntity],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    BlogModule,
    CommentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
