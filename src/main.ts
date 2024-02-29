import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './core/modules/app.module';
import swaggerConfigOptions from './configurations/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.setGlobalPrefix('api/v1');

  const document = SwaggerModule.createDocument(app, swaggerConfigOptions);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap();
