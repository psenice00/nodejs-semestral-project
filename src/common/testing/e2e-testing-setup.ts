import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { getDataSouce } from './orm.config';
import { TestingAppModule } from './testing.module';

export class TestingSetup {
  app: INestApplication;
  module: TestingModule;
  db: DataSource;

  static async setup(): Promise<TestingSetup> {
    const testing = new TestingSetup();

    testing.module = await Test.createTestingModule({
      imports: [TestingAppModule],
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
  async clearDb(): Promise<void> {
    await this.db.synchronize(true);
  }

  async close(): Promise<void> {
    await this.app.close();
    await this.db.destroy();
    await this.module.close();
  }
}
