import { Exclude, Expose } from 'class-transformer';
import { of } from 'rxjs';
import { TransformInterceptor } from './transform.interceptor';

@Exclude()
class UserDto {
  @Expose()
  id: number;

  @Expose()
  name: string;
}

class User {
  id: number;
  name: string;
  password: string;
}

const executionContext: any = {
  switchToHttp: jest.fn().mockReturnThis(),
  getRequest: jest.fn().mockReturnThis(),
};

const mockHandler = {
  handle: jest.fn(() =>
    of({
      id: 123,
      name: 'José',
    } as User),
  ),
};

describe('TransformInterceptor', () => {
  const interceptor = new TransformInterceptor(UserDto);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should transform data', () => {
    interceptor.intercept(executionContext, mockHandler).subscribe({
      next: (response) => {
        expect(response).toEqual({
          id: 123,
          name: 'José',
        });
      },
      error: () => fail('Not Expected'),
    });
  });
});
