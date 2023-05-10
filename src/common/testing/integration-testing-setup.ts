import { Abstract, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { getDataSouce } from './orm.config';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserEntity } from 'src/users/database/user.entity';
import { BlogEntity } from 'src/blogs/database/blog.entity';
import { CommentEntity } from 'src/comments/database/comment.entity';

export class IntegrationTestingSetup {
  app: INestApplication;
  module: TestingModule;
  db: DataSource;
  entities: Abstract<any>[];

  static async setup(modules: {
    providers: any[];
    imports?: any[];
  }): Promise<IntegrationTestingSetup> {
    const testing = new IntegrationTestingSetup();
    testing.entities = [UserEntity, BlogEntity, CommentEntity];

    testing.module = await Test.createTestingModule({
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
            entities: testing.entities,
            synchronize: true,
          }),
          inject: [ConfigService],
        }),
        TypeOrmModule.forFeature(testing.entities),
        ...(modules.imports ?? []),
      ],
      providers: [...modules.providers],
    }).compile();

    testing.app = testing.module.createNestApplication();
    testing.db = getDataSouce(testing.app);
    await testing.db.initialize().catch((err) => {
      console.error(`Data Source initialization error`, err);
    });
    await testing.db.synchronize(true);

    testing.app = testing.module.createNestApplication();
    await testing.app.init();

    return testing;
  }

  getModule<T>(module: Abstract<T>): T {
    return this.module.get(module);
  }

  async clearDb(): Promise<void> {
    await this.db.dropDatabase();
    await this.db.synchronize(true);
  }

  async close(): Promise<void> {
    await this.app.close();
    await this.db.destroy();
    await this.module.close();
  }
}
