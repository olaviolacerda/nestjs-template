import { Module } from '@nestjs/common';
import { AppController } from '../../api/controllers/app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from '../../domain/services/app.service';
import { AuthModule } from 'src/infra/modules/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UsersModule } from './users.module';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: ['dist/**/*.entity{.ts,.js}'],
        synchronize: false,
        autoLoadEntities: true,
        migrations: [__dirname + 'db/migrations/*{.ts,.js}'],
        seeds: [__dirname + 'db/seeds/**/*{.ts,.js}'],
        factories: [__dirname + 'db/factories/**/*{.ts,.js}'],
        cli: {
          migrationsDir: __dirname + 'db/migrations/',
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule {}
