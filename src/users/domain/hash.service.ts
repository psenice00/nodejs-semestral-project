import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  async hash(str: string): Promise<string> {
    return bcrypt.hash(str, +process.env.SALT_ROUND ?? 10);
  }

  async compare(str: string, hash: string): Promise<boolean> {
    return bcrypt.compare(str, hash);
  }
}
