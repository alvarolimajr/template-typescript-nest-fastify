import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpExceptionFilter } from './http-exception.filter';

const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
};
const mockJson = jest.fn();
const mockStatus = jest.fn().mockImplementation(() => ({
  send: mockJson,
}));
const mockGetRequest = jest.fn().mockImplementation(() => ({
  method: 'GET',
  url: '/api/v1/users/00000',
  headers: { 'x-request-id': '123456' },
}));
const mockGetResponse = jest.fn().mockImplementation(() => ({
  status: mockStatus,
}));
const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
  getResponse: mockGetResponse,
  getRequest: mockGetRequest,
}));

const mockArgumentsHost = {
  switchToHttp: mockHttpArgumentsHost,
  getArgByIndex: jest.fn(),
  getArgs: jest.fn(),
  getType: jest.fn(),
  switchToRpc: jest.fn(),
  switchToWs: jest.fn(),
};

describe('System header validation service', () => {
  let filter: HttpExceptionFilter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HttpExceptionFilter,
        {
          provide: Logger,
          useValue: mockLogger,
        },
      ],
    }).compile();
    filter = module.get<HttpExceptionFilter>(HttpExceptionFilter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('All exception filter tests', () => {
    it('should be defined', () => {
      expect(filter).toBeDefined();
    });

    it('Http exception', () => {
      filter.catch(new NotFoundException('User not found'), mockArgumentsHost);
      expect(mockHttpArgumentsHost).toBeCalledTimes(1);
      expect(mockHttpArgumentsHost).toBeCalledWith();
      expect(mockGetResponse).toBeCalledTimes(1);
      expect(mockGetResponse).toBeCalledWith();
      expect(mockStatus).toBeCalledTimes(1);
      expect(mockStatus).toBeCalledWith(HttpStatus.NOT_FOUND);
      expect(mockJson).toBeCalledTimes(1);
      expect(mockJson).toBeCalledWith({
        message: 'User not found',
        statusCode: 404,
        timestamp: expect.anything(),
      });
    });

    it('bad request error', () => {
      filter.catch(
        new BadRequestException({
          message: [
            'password should not be empty',
            'password should not be null',
          ],
        }),
        mockArgumentsHost,
      );
      expect(mockStatus).toBeCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockJson).toBeCalledWith({
        message: 'password should not be empty',
        statusCode: 400,
        timestamp: expect.anything(),
      });
    });

    it('conflict exception', () => {
      filter.catch(
        new ConflictException('status in conflict'),
        mockArgumentsHost,
      );
      expect(mockStatus).toBeCalledWith(HttpStatus.CONFLICT);
      expect(mockJson).toBeCalledWith({
        message: 'status in conflict',
        statusCode: 409,
        timestamp: expect.anything(),
      });
    });

    it('internal server error', () => {
      filter.catch(new Error('Internal Server Error'), mockArgumentsHost);
      expect(mockStatus).toBeCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockJson).toBeCalledWith({
        message: 'An internal server error occurred, please contact support.',
        statusCode: 500,
        timestamp: expect.anything(),
      });
    });

    it('too large error', () => {
      const error = { type: 'entity.too.large', length: 2048, limit: 1024 };

      filter.catch(error, mockArgumentsHost);
      expect(mockStatus).toBeCalledWith(HttpStatus.PAYLOAD_TOO_LARGE);
      expect(mockJson).toBeCalledWith({
        message: `
        Your request entity size is too big for the server to process it:
          - request size: ${error.length};
          - request limit: ${error.limit}.`,
        statusCode: 413,
        timestamp: expect.anything(),
      });
    });
  });
});
