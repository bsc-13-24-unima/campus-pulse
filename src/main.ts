import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://127.0.0.1:5501'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Campus Pulse API')
    .setDescription('API documentation for the Campus Pulse backend')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.PORT || 3000;
  await app.listen(3000, '0.0.0.0');
  console.log(`Campus Pulse API running on port ${port}`);
}
bootstrap();