import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { TOO_MANY_REQUESTS } from './common/exceptions/exception';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Semestrální práce node.js')
    .setDescription('REST server pro blog s důrazem na security')
    .setVersion('1.0')
    .addTag('blog')
    .addBearerAuth(undefined, 'ApiKeyAuth')
    .addSecurityRequirements('ApiKeyAuth')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  //sensitive data exposure + mass assignment
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  //xss, clickjacking, ssrf (pokud bereme url)
  app.use(helmet());

  app.enableCors({
    origin: 'localhost',
  });

  // lack of resources and rate limiting
  app.use(
    rateLimit({
      windowMs: 10 * 60 * 1000,
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
      skipSuccessfulRequests: false, // The counting will skip all successful requests and just count the errors. Instead of removing rate-limiting, it's better to set this to true to limit the number of times a request fails. Can help prevent against brute-force attacks
      message: { message: TOO_MANY_REQUESTS, statusCode: 429 },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
