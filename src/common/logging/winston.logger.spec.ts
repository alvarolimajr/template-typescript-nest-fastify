import { requestContext } from '@fastify/request-context';
import * as winston from 'winston';
import { WinstonLogger } from './winston.logger';

jest.mock('@fastify/request-context', () => ({
  requestContext: {
    get: jest.fn(),
  },
}));

describe('WinstonLogger', () => {
  let logger: WinstonLogger;

  beforeEach(() => {
    logger = new WinstonLogger({
      transports: [new winston.transports.Console()],
    });
    logger.setContext(WinstonLogger.name);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(logger).toBeDefined();
  });

  it('should call log', () => {
    const logSpy = jest.spyOn(WinstonLogger.prototype, 'log');
    logger.log('log');
    expect(logSpy).toBeCalledTimes(1);
    expect(requestContext.get).toBeCalledTimes(1);
  });

  it('should call log with message object', () => {
    const logSpy = jest.spyOn(WinstonLogger.prototype, 'log');
    logger.log({ message: 'log' });
    expect(logSpy).toBeCalledTimes(1);
    expect(requestContext.get).toBeCalledTimes(1);
  });

  it('should call error', () => {
    const errorSpy = jest.spyOn(WinstonLogger.prototype, 'error');
    logger.error('error');
    expect(errorSpy).toBeCalledTimes(1);
    expect(requestContext.get).toBeCalledTimes(1);
  });

  it('should call error with Error', () => {
    const errorSpy = jest.spyOn(WinstonLogger.prototype, 'error');
    logger.error(new Error('error'));
    expect(errorSpy).toBeCalledTimes(1);
  });

  it('should call error with message object', () => {
    const errorSpy = jest.spyOn(WinstonLogger.prototype, 'error');
    logger.error({ message: 'error' });
    expect(errorSpy).toBeCalledTimes(1);
    expect(requestContext.get).toBeCalledTimes(1);
  });

  it('should call warn', () => {
    const warnSpy = jest.spyOn(WinstonLogger.prototype, 'warn');
    logger.warn('warn');
    expect(warnSpy).toBeCalledTimes(1);
    expect(requestContext.get).toBeCalledTimes(1);
  });

  it('should call warn with message object', () => {
    const warnSpy = jest.spyOn(WinstonLogger.prototype, 'warn');
    logger.warn({ message: 'warn' });
    expect(warnSpy).toBeCalledTimes(1);
  });

  it('should call debug', () => {
    const debugSpy = jest.spyOn(WinstonLogger.prototype, 'debug');
    logger.debug('debug');
    expect(debugSpy).toBeCalledTimes(1);
  });

  it('should call debug with message object', () => {
    const debugSpy = jest.spyOn(WinstonLogger.prototype, 'debug');
    logger.debug({ message: 'debug' });
    expect(debugSpy).toBeCalledTimes(1);
    expect(requestContext.get).toBeCalledTimes(1);
  });

  it('should call verbose', () => {
    const verboseSpy = jest.spyOn(WinstonLogger.prototype, 'verbose');
    logger.verbose('verbose');
    expect(verboseSpy).toBeCalledTimes(1);
    expect(requestContext.get).toBeCalledTimes(1);
  });

  it('should call verbose with message object', () => {
    const verboseSpy = jest.spyOn(WinstonLogger.prototype, 'verbose');
    logger.verbose({ message: 'verbose' });
    expect(verboseSpy).toBeCalledTimes(1);
    expect(requestContext.get).toBeCalledTimes(1);
  });
});
