import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { of, throwError } from 'rxjs';
import { LoggingInterceptor } from './logging.interceptor';

jest.mock('@nestjs/core', () => ({
  Reflector: jest.fn().mockImplementation(() => {
    return {
      get: jest.fn(),
    };
  }),
}));

const method = 'GET';
const url = '/api/v1/users/1';
const payload = {
  id: 123,
  name: 'José',
};

const mockGetRequest = jest.fn().mockImplementation(() => ({
  method,
  url,
  body: {},
  headers: { header: 'value' },
}));

const mockGetResponse = jest.fn().mockImplementation(() => ({
  statusCode: 200,
}));

const executionContext: any = {
  switchToHttp: jest.fn().mockReturnThis(),
  getRequest: mockGetRequest,
  getResponse: mockGetResponse,
  getHandler: jest.fn(),
};

const mockHandler = {
  handle: jest.fn(() => of(payload)),
};

const mockBadRequestHandler = {
  handle: jest.fn(() => throwError(() => new BadRequestException())),
};

const mockInternalErrorHandler = {
  handle: jest.fn(() => throwError(() => new InternalServerErrorException())),
};

const mockErrorHandler = {
  handle: jest.fn(() => throwError(() => new Error('Generic Error'))),
};

describe('LoggingInterceptor', () => {
  const ctx = `LoggingInterceptor - ${method} - ${url}`;
  const incomingMsg = `Incoming request - ${method} - ${url}`;

  let reflector: Reflector;
  let interceptor: LoggingInterceptor;

  beforeEach(() => {
    reflector = new Reflector();
    interceptor = new LoggingInterceptor(reflector);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should be not intercepted', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(true);
    const debugSpy = jest.spyOn(Logger.prototype, 'debug');
    const errorSpy = jest.spyOn(Logger.prototype, 'error');
    const warnSpy = jest.spyOn(Logger.prototype, 'warn');

    interceptor.intercept(executionContext, mockHandler).subscribe({
      next: () => {
        expect(debugSpy).not.toHaveBeenCalled();
        expect(errorSpy).not.toHaveBeenCalled();
        expect(warnSpy).not.toHaveBeenCalled();
      },
      error: () => fail('Not Expected'),
    });
  });

  it('logs the input and output request details - OK status code', () => {
    const resCtx = `LoggingInterceptor - 200 - ${method} - ${url}`;
    const outgoingMsg = `Outgoing response - 200 - ${method} - ${url}`;

    const debugSpy = jest.spyOn(Logger.prototype, 'debug');

    interceptor.intercept(executionContext, mockHandler).subscribe({
      next: (response) => {
        expect(response).toEqual(payload);

        expect(debugSpy).toBeCalledTimes(2);
        expect(debugSpy.mock.calls[0]).toEqual([
          {
            body: {},
            headers: expect.any(Object),
            message: incomingMsg,
            method,
          },
          ctx,
        ]);
        expect(debugSpy.mock.calls[1]).toEqual([
          {
            message: outgoingMsg,
            body: payload,
          },
          resCtx,
        ]);
      },
      error: () => fail('Not Expected'),
    });
  });

  it('logs the input and output request details - BAD_REQUEST status code', () => {
    const resCtx = `LoggingInterceptor - 400 - ${method} - ${url}`;
    const outgoingMsg = `Outgoing response - 400 - ${method} - ${url}`;

    const debugSpy = jest.spyOn(Logger.prototype, 'debug');
    const warnSpy = jest.spyOn(Logger.prototype, 'warn');
    const errorSpy = jest.spyOn(Logger.prototype, 'error');

    interceptor.intercept(executionContext, mockBadRequestHandler).subscribe({
      error: () => {
        expect(debugSpy).toBeCalledTimes(1);
        expect(debugSpy.mock.calls[0]).toEqual([
          {
            body: {},
            headers: expect.any(Object),
            message: incomingMsg,
            method,
          },
          ctx,
        ]);
        expect(warnSpy).toBeCalledTimes(1);
        expect(warnSpy.mock.calls[0]).toEqual([
          {
            message: outgoingMsg,
            method,
            url,
            body: {},
            error: expect.any(BadRequestException),
          },
          resCtx,
        ]);

        expect(errorSpy).not.toHaveBeenCalled();
      },
    });
  });

  it('logs the input and output request details - INTERNAL_SERVER_ERROR status code', () => {
    const resCtx = `LoggingInterceptor - 500 - ${method} - ${url}`;
    const outgoingMsg = `Outgoing response - 500 - ${method} - ${url}`;

    const debugSpy = jest.spyOn(Logger.prototype, 'debug');
    const warnSpy = jest.spyOn(Logger.prototype, 'warn');
    const errorSpy = jest.spyOn(Logger.prototype, 'error');

    interceptor
      .intercept(executionContext, mockInternalErrorHandler)
      .subscribe({
        error: () => {
          expect(debugSpy).toBeCalledTimes(1);
          expect(debugSpy.mock.calls[0]).toEqual([
            {
              body: {},
              headers: expect.any(Object),
              message: incomingMsg,
              method,
            },
            ctx,
          ]);
          expect(errorSpy).toBeCalledTimes(1);
          expect(errorSpy.mock.calls[0]).toEqual([
            {
              message: outgoingMsg,
              method,
              url,
              body: {},
              error: expect.any(InternalServerErrorException),
            },
            expect.any(String),
            resCtx,
          ]);

          expect(warnSpy).not.toHaveBeenCalled();
        },
      });
  });

  it('logs the input and output request details - GENERIC_ERROR status code', () => {
    const resCtx = `LoggingInterceptor - ${method} - ${url}`;
    const outgoingMsg = `Outgoing response - ${method} - ${url}`;

    const debugSpy = jest.spyOn(Logger.prototype, 'debug');
    const warnSpy = jest.spyOn(Logger.prototype, 'warn');
    const errorSpy = jest.spyOn(Logger.prototype, 'error');

    interceptor.intercept(executionContext, mockErrorHandler).subscribe({
      error: () => {
        expect(debugSpy).toBeCalledTimes(1);
        expect(debugSpy.mock.calls[0]).toEqual([
          {
            body: {},
            headers: expect.any(Object),
            message: incomingMsg,
            method,
          },
          ctx,
        ]);
        expect(errorSpy).toBeCalledTimes(1);
        expect(errorSpy.mock.calls[0]).toEqual([
          {
            message: outgoingMsg,
          },
          expect.any(String),
          resCtx,
        ]);
        expect(warnSpy).not.toHaveBeenCalled();
      },
    });
  });
});
