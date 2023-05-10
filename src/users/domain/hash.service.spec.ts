import { Test, TestingModule } from '@nestjs/testing';
import { HashService } from './hash.service';

describe('HashService', () => {
  let service: HashService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HashService],
    }).compile();

    service = module.get<HashService>(HashService);
  });

  it('should encrypt/decrypt message', async () => {
    const password = 'password';
    const encrypted = await service.hash(password);
    const decrypted = service.compare(password, encrypted);
    expect(decrypted).toBeTruthy();
  });

  it('should not accept invalid initial vector', async () => {
    const password = 'password';
    const encrypted = await service.hash(password);
    const decrypted = service.compare('differentPassword', encrypted);
    expect(decrypted).toBeTruthy();
  });
});
