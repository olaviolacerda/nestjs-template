import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { AppService } from '../../domain/services/app.service';
import { AuthService } from '../../domain/services/auth.service';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { Public } from '../../common/decorators/public.decorator';
import { LocalAuthGuard } from '../../auth/guards/local.guard';

@Controller('app')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
