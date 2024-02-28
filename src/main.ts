import { NestFactory } from '@nestjs/core';
import { AppModule } from './core/modules/app.module';
import { SwaggerModule } from '@nestjs/swagger';
import swaggerDocumentOptions from './configuration/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.setGlobalPrefix('api/v1');

  const document = SwaggerModule.createDocument(app, swaggerDocumentOptions);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap();
