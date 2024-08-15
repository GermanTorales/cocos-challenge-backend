import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';

import { AppModule } from './app.module';
import { EnvObj, IApp } from '@config/env-vars';
import { morganConfig } from '@config/morgan';
import { AllExceptionsFilter } from '@common/filters';

async function bootstrap() {
  const logger: Logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const appConfig = configService.get<IApp>(EnvObj.APP);
  const httpAdapter = app.get(HttpAdapterHost);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      validationError: {
        target: false,
      },
    }),
  );

  app.use(morganConfig.successHandler);
  app.use(morganConfig.errorHandler);

  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, prefix: 'v', defaultVersion: '1' });
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter, configService));

  await app.listen(appConfig.PORT, () => logger.log(`Server running on port: ${appConfig.PORT}`));
}
bootstrap();
