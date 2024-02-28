import {
  Controller,
  Post,
  UseGuards,
  HttpCode,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from '../../core/services/auth.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDto, LoginResponse } from '../../common/dtos/auth.dto';
import { LocalAuthGuard } from '../../core/auth/guards/local.guard';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt.guard';
import { JwtRefreshAuthGuard } from 'src/core/auth/guards/jwt-refresh.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'login user' })
  @ApiResponse({
    status: 200,
    type: LoginResponse,
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
    type: LoginResponse,
    description: 'Tokens was successfully refreshed.',
  })
  @HttpCode(200)
  @UseGuards(JwtRefreshAuthGuard)
  @Get('refresh')
  refreshTokens(@Request() req) {
    return this.authService.refreshTokens(req.user);
  }
}
