import { Controller, Post, UseGuards, Request, HttpCode } from '@nestjs/common';
import { AuthService } from '../../domain/services/auth.service';
import { LocalAuthGuard } from '../../auth/guards/local.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginResponse } from 'src/infra/dtos/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'login user' })
  @ApiResponse({
    status: 200,
    type: LoginResponse,
  })
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
