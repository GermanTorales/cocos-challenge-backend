import { HttpAdapterHost } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, HttpException } from '@nestjs/common';

import { GenericHttpException } from '@common/exceptions';
import { EEnvironment, EnvObj, IApp } from '@config/env-vars';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly env: string;

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly configService: ConfigService,
  ) {
    this.env = configService.get<IApp>(EnvObj.APP).ENV;
  }

  catch(exception: HttpException, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    if (this.env === EEnvironment.LOCAL) console.log(exception);

    const isGenericHttpException = exception instanceof GenericHttpException;
    const genericHttpException = isGenericHttpException ? exception.getBody() : {};

    const statusCode = exception?.getStatus() || HttpStatus.NOT_FOUND;

    const httpExceptionBody = {
      statusCode,
      message: exception['response']?.message || exception?.['response'] || exception.message,
      isError: true,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    httpAdapter.reply(ctx.getResponse(), { ...genericHttpException, ...httpExceptionBody }, statusCode);
  }
}
