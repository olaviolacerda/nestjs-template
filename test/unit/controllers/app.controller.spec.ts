import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../../../src/api/controllers/app.controller';
import { AppService } from '../../../src/domain/services/app.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../../../src/auth/guards/jwt.guard';
import { UsersService } from '../../../src/domain/services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '../../../src/config/config.service';
import { AuthModule } from '../../../src/infra/modules/auth.module';
import { UsersModule } from '../../../src/infra/modules/users.module';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        AuthModule,
        UsersModule,
      ],
      controllers: [AppController],
      providers: [
        {
          provide: APP_GUARD,
          useClass: JwtAuthGuard,
        },
        AppService,
        UsersService,
      ],
    }).compile();
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      const appController = app.get(AppController);
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
