import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';

import { ApiResponse } from '@common/interfaces';

@Injectable()
export class NormalizeResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        let content;

        if (Array.isArray(data)) content = { list: data, count: data.length };
        else content = data;

        return {
          status: context.switchToHttp().getResponse().statusCode,
          message: 'Api request [SUCCESS]',
          data: content,
          isError: false,
          timestamp: new Date().toISOString(),
          path: context.switchToHttp().getRequest().url,
        };
      }),
    );
  }
}
