import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const swaggerConfig = (app: INestApplication<any>) => {
  const options = new DocumentBuilder()
    .setTitle('Cocos Challenge API')
    .setDescription('Documentacion de la API para el challenge de Cocos.')
    .setVersion('1.0')
    .addTag('Cocos')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api-docs', app, document, {});
};
