import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { FastifyReply, FastifyRequest } from 'fastify';
import newrelic from 'newrelic';
import { getErrorCode, getErrorMessage } from './error.utils';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private static readonly X_REQUEST_ID_HEADER_NAME = 'x-request-id';

  private readonly logger: Logger = new Logger(HttpExceptionFilter.name);

  public catch(exception: any, host: ArgumentsHost): void {
    newrelic.noticeError(exception);

    const ctx: HttpArgumentsHost = host.switchToHttp();
    const request = ctx.getRequest<FastifyRequest>();
    const response = ctx.getResponse<FastifyReply>();
    const requestId = this.extractRequestId(request);

    let statusCode: number;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
    } else {
      // Case of a PayloadTooLarge
      const type: string | undefined = exception?.type;
      statusCode =
        type === 'entity.too.large'
          ? HttpStatus.PAYLOAD_TOO_LARGE
          : HttpStatus.INTERNAL_SERVER_ERROR;
    }

    let status: string =
      exception instanceof HttpException
        ? getErrorCode(exception.getResponse())
        : HttpStatus[HttpStatus.INTERNAL_SERVER_ERROR];

    let message: string =
      exception instanceof HttpException
        ? getErrorMessage(exception.getResponse())
        : 'An internal server error occurred, please contact support.';

    if (statusCode === HttpStatus.PAYLOAD_TOO_LARGE) {
      status = HttpStatus[HttpStatus.PAYLOAD_TOO_LARGE];
      message = `
        Your request entity size is too big for the server to process it:
          - request size: ${exception?.length};
          - request limit: ${exception?.limit}.`;
    }

    const exceptionStack: string = 'stack' in exception ? exception.stack : '';

    if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        {
          message: `${statusCode} [${request.method} ${request.url}] has thrown a critical error`,
          headers: request.headers,
          status,
          requestId,
        },
        exceptionStack,
      );
    } else if (statusCode >= HttpStatus.BAD_REQUEST) {
      this.logger.warn({
        message: `${statusCode} [${request.method} ${request.url}] has thrown an HTTP client error`,
        exceptionStack,
        headers: request.headers,
        status,
        requestId,
      });
    }

    response.status(statusCode).send({
      statusCode,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   *
   * @param request
   */
  private extractRequestId(request: FastifyRequest): string {
    return request.headers[
      HttpExceptionFilter.X_REQUEST_ID_HEADER_NAME
    ] as string;
  }
}
