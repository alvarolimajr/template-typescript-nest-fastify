import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IGNORE_LOGGING_INTERCEPTOR } from './logging.constants';

/**
 * Interceptor that logs input/output requests
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly ctxPrefix = LoggingInterceptor.name;
  private readonly logger = new Logger(this.ctxPrefix);

  constructor(private readonly reflector: Reflector) {}

  /**
   * Intercept method, logs before and after the request being processed
   * @param context details about the current request
   * @param call$ implements the handle method that returns an Observable
   */
  public intercept(
    context: ExecutionContext,
    call$: CallHandler,
  ): Observable<unknown> {
    const ignore = this.reflector.get<boolean>(
      IGNORE_LOGGING_INTERCEPTOR,
      context.getHandler(),
    );

    if (ignore) {
      return call$.handle();
    }

    const req = context.switchToHttp().getRequest<FastifyRequest>();
    const { method, url, body, headers } = req;
    const ctx = `${this.ctxPrefix} - ${method} - ${url}`;
    const message = `Incoming request - ${method} - ${url}`;

    this.logger.debug(
      {
        message,
        method,
        body,
        headers,
      },
      ctx,
    );

    return call$.handle().pipe(
      tap({
        next: (val: unknown): void => {
          this.logNext(val, context);
        },
        error: (err: Error): void => {
          this.logError(err, context);
        },
      }),
    );
  }

  /**
   * Logs the request response in success cases
   * @param body body returned
   * @param context details about the current request
   */
  private logNext(body: unknown, context: ExecutionContext): void {
    const req = context.switchToHttp().getRequest<FastifyRequest>();
    const res = context.switchToHttp().getResponse<FastifyReply>();
    const { method, url } = req;
    const { statusCode } = res;
    const ctx = `${this.ctxPrefix} - ${statusCode} - ${method} - ${url}`;
    const message = `Outgoing response - ${statusCode} - ${method} - ${url}`;

    this.logger.debug(
      {
        message,
        body,
      },
      ctx,
    );
  }

  /**
   * Logs the request response in success cases
   * @param error Error object
   * @param context details about the current request
   */
  private logError(error: Error, context: ExecutionContext): void {
    const req = context.switchToHttp().getRequest<FastifyRequest>();
    const { method, url, body } = req;

    if (error instanceof HttpException) {
      const statusCode = error.getStatus();
      const ctx = `${this.ctxPrefix} - ${statusCode} - ${method} - ${url}`;
      const message = `Outgoing response - ${statusCode} - ${method} - ${url}`;

      if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
        this.logger.error(
          {
            method,
            url,
            body,
            message,
            error,
          },
          error.stack,
          ctx,
        );
      } else {
        this.logger.warn(
          {
            method,
            url,
            error,
            body,
            message,
          },
          ctx,
        );
      }
    } else {
      this.logger.error(
        {
          message: `Outgoing response - ${method} - ${url}`,
        },
        error.stack,
        `${this.ctxPrefix} - ${method} - ${url}`,
      );
    }
  }
}
