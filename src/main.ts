import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('freecodecamp nestjs tutorial')
    .setDescription('The freecodecamp API description')
    .setVersion('1.0')
    .addTag('freecodecamp')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe({}));
  //app.useGlobalGuards(new JwtAtGuard(new Reflector())); //Loofk provider in app.module.ts
  await app.listen(3000);
}
bootstrap();
