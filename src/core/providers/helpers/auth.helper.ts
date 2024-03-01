import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';

@Injectable()
export class AuthHelper {
  async hashToken(refreshToken: string): Promise<string> {
    const hash = createHash('sha256').update(refreshToken).digest('hex');
    const hashedToken = await bcrypt.hashSync(hash, 10);
    return hashedToken;
  }
}
