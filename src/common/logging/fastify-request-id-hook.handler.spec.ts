import { requestContext, RequestContextData } from '@fastify/request-context';
import { FastifyRequest } from 'fastify';
import {
  fastifyRequestIdHookHandler,
  REQUEST_ID_HEADER_KEY,
} from './fastify-request-id-hook.handler';

jest.mock('@fastify/request-context', () => ({
  requestContext: {
    get: jest.fn(),
    set: jest.fn(),
  },
}));

const mockRequestHeader: FastifyRequest = {
  id: undefined,
  params: undefined,
  raw: undefined,
  body: undefined,
  server: undefined,
  query: undefined,
  log: undefined,
  req: undefined,
  ip: undefined,
  hostname: undefined,
  url: undefined,
  protocol: undefined,
  method: undefined,
  is404: undefined,
  socket: undefined,
  requestContext: {
    get: jest.fn(),
    set: jest.fn(),
    getStore: function (): RequestContextData | undefined {
      throw new Error('Function not implemented.');
    },
  },
  headers: {
    [REQUEST_ID_HEADER_KEY]: 'requestId',
  },
  getValidationFunction: jest.fn(),
  compileValidationSchema: jest.fn(),
  validateInput: jest.fn(),
  routeOptions: undefined,
  originalUrl: 'localhost',
  host: 'localhost',
  port: 4000,
  getDecorator: jest.fn(),
  setDecorator: jest.fn(),
};

const mockDone = jest.fn();

describe('fastifyRequestIdHookHandler', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be called', () => {
    fastifyRequestIdHookHandler(mockRequestHeader, null, mockDone);

    expect(requestContext.set).toHaveBeenCalledTimes(1);
    expect(mockDone).toHaveBeenCalledTimes(1);
  });
});
