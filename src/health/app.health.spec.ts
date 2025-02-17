import { HealthIndicatorService } from '@nestjs/terminus';
import { Test } from '@nestjs/testing';
import { AppHealthIndicator } from './app.health';

const healthIndicatorSessionMock = {
  up: jest.fn(),
  down: jest.fn(),
};

const healthIndicatorServiceMock = {
  check: jest.fn().mockImplementation(() => healthIndicatorSessionMock),
};

describe('AppHealthIndicator', () => {
  let appHealthIndicator: AppHealthIndicator;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AppHealthIndicator,
        {
          provide: HealthIndicatorService,
          useValue: healthIndicatorServiceMock,
        },
      ],
    }).compile();

    appHealthIndicator = await moduleRef.resolve(AppHealthIndicator);
  });

  it('marks the indicator as up', async () => {
    // Act
    await appHealthIndicator.isHealthy('app');

    expect(healthIndicatorSessionMock.up).toHaveBeenCalled();
  });
});
