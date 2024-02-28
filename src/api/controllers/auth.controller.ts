import { Controller, Post, UseGuards, Request, HttpCode } from '@nestjs/common';
import { AuthService } from '../../core/services/auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto, LoginResponse } from '../../common/dtos/auth.dto';
import { LocalAuthGuard } from '../../core/auth/guards/local.guard';

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
}
