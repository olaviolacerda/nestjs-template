import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import * as bcrypt from 'bcrypt';

import {
  Tokens,
  PayloadToken,
} from '../../../common/interfaces/auth.interface';
import { UsersService } from './users.service';
import { AuthHelper } from '../helpers/auth.helper';
import { User } from '../../../common/interfaces/users.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private authHelper: AuthHelper,
  ) {}

  async validateUser(username: string, pass: string): Promise<Partial<User>> {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new BadRequestException('Something is wrong with your credentials');
    }

    const passwordMatches = await bcrypt.compare(pass, user?.password);

    if (passwordMatches) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: PayloadToken): Promise<Tokens> {
    const tokens = await this.getTokens({ id: user.id, role: user.role });
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: User['id']): Promise<Partial<User>> {
    return this.usersService.update(userId, { refreshToken: null });
  }

  async updateRefreshToken(
    userId: User['id'],
    refreshToken: User['refreshToken'],
  ): Promise<void> {
    const hashedRefreshToken = await this.authHelper.hashToken(refreshToken);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async refreshTokens(user: PayloadToken): Promise<Tokens> {
    const tokens = await this.getTokens({ id: user.id, role: user.role });
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async getTokens(user: PayloadToken): Promise<Tokens> {
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
