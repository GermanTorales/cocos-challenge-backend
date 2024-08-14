import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, VersioningType } from '@nestjs/common';

import { AppModule } from './app.module';
import { EnvObj, IApp } from '@config/env-vars';
import { morganConfig } from '@config/morgan';

async function bootstrap() {
  const logger: Logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const appConfig = configService.get<IApp>(EnvObj.APP);

  app.use(morganConfig.successHandler);
  app.use(morganConfig.errorHandler);

  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI });

  await app.listen(appConfig.PORT, () => logger.log(`Server running on port: ${appConfig.PORT}`));
}
bootstrap();
