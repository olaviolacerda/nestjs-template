import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { PayloadToken } from '../../common/dtos/auth.dto';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string): Promise<Partial<User>> {
    const user = await this.usersService.findByUsername(username);
    const passwordMatches = await bcrypt.compare(pass, user.password);
    if (passwordMatches) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: PayloadToken) {
    const tokens = await this.getTokens({ id: user.id, role: user.role });
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: User['id']) {
    return this.usersService.update(userId, { refreshToken: null });
  }

  async updateRefreshToken(
    userId: User['id'],
    refreshToken: User['refreshToken'],
  ) {
    const hash = createHash('sha256').update(refreshToken).digest('hex');

    const hashedRefreshToken = await bcrypt.hashSync(hash, 10);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async refreshTokens(user: PayloadToken) {
    const tokens = await this.getTokens({ id: user.id, role: user.role });
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async getTokens(user: PayloadToken) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(user, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(user, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
