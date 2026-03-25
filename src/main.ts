import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(); // allow frontend to access APIs

  const config = new DocumentBuilder()
    .setTitle('Labor Attendance API')
    .setDescription('API for tracking labor daily attendance and weekly payments')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // default to 3001
  await app.listen(process.env.PORT ?? 4400);
}
bootstrap();
