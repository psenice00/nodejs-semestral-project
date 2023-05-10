import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { BlogModule } from 'src/blogs/blogs.module';
import { BlogEntity } from 'src/blogs/database/blog.entity';
import { CommentModule } from 'src/comments/comments.module';
import { CommentEntity } from 'src/comments/database/comment.entity';
import { UserEntity } from 'src/users/database/user.entity';
import { UserModule } from 'src/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_TEST_HOST'),
        port: +configService.get('DB_TEST_PORT'),
        username: configService.get('DB_TEST_USERNAME'),
        password: configService.get('DB_TEST_PASSWORD'),
        database: configService.get('DB_TEST_DATABASE'),
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
export class TestingAppModule {}
