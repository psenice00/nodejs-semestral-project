import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from 'src/users/database/user.entity';
import { BlogEntity } from 'src/blogs/database/blog.entity';
import { CommentEntity } from 'src/comments/database/comment.entity';

export const getDataSouce = (app: INestApplication): DataSource => {
  const configService = app.get(ConfigService);

  const ormConfig: PostgresConnectionOptions = {
    type: 'postgres',
    host: configService.get('DB_TEST_HOST') ?? 'localhost',
    port: configService.get('DB_TEST_PORT') ?? 5432,
    username: configService.get('DB_TEST_USERNAME') ?? 'postgres',
    password: configService.get('DB_TEST_PASSWORD') ?? 'admin',
    database: configService.get('DB_TEST_DATABASE') ?? 'security_test',
    entities: [UserEntity, BlogEntity, CommentEntity],
    synchronize: true,
  };

  return new DataSource(ormConfig);
};
