import {
  Controller,
  Post,
  UseGuards,
  HttpCode,
  Get,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { LoginDto } from '../../common/dtos/auth/login.dto';
import { TokensResponse } from '../../common/responses/auth/tokens.response';
import { JwtRefreshAuthGuard } from '../../core/auth/guards/jwt-refresh.guard';
import { JwtAuthGuard } from '../../core/auth/guards/jwt.guard';
import { LocalAuthGuard } from '../../core/auth/guards/local.guard';
import { AuthService } from '../../core/providers/services/auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'login user' })
  @ApiResponse({
    status: 200,
    type: TokensResponse,
    description: 'User was successfully logged in.',
  })
  @HttpCode(200)
  @ApiBody({ type: LoginDto })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @ApiOperation({ summary: 'log out user' })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: 'User was successfully logged out.',
  })
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Get('logout')
  logout(@Request() req) {
    this.authService.logout(req.user['id']);
  }

  @ApiOperation({ summary: 'refresh tokens' })
  @ApiBearerAuth('refresh-token')
  @ApiResponse({
    status: 200,
    type: TokensResponse,
    description: 'Tokens was successfully refreshed.',
  })
  @HttpCode(200)
  @UseGuards(JwtRefreshAuthGuard)
  @Get('refresh')
  refreshTokens(@Request() req) {
    return this.authService.refreshTokens(req.user);
  }
}
