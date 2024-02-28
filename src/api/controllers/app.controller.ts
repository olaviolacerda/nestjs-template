import { Controller, Get } from '@nestjs/common';
import { AppService } from '../../domain/services/app.service';
import { Public } from '../../common/decorators/public.decorator';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

@ApiTags('app')
@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'hello world' })
  @ApiResponse({
    status: 200,
    type: String,
  })
  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
