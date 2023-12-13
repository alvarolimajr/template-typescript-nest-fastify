import { ErrorResponseDto } from './error-response.dto';

describe('ErrorResponseDto', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(new ErrorResponseDto()).toBeDefined();
  });

  it('should be defined', () => {
    expect(
      new ErrorResponseDto({
        statusCode: 500,
        message: 'Error message',
        timestamp: new Date().toISOString(),
      }),
    ).toMatchObject({
      statusCode: 500,
      message: 'Error message',
      timestamp: expect.any(String),
    });
  });
});
