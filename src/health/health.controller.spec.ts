import { TerminusModule } from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';
import { AppHealthIndicator } from './app.health';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TerminusModule],
      controllers: [HealthController],
      providers: [AppHealthIndicator],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an address by zip code', async () => {
    const expected = {
      status: 'ok',
      details: {
        app: {
          status: 'up',
        },
      },
      error: {},
      info: {
        app: {
          status: 'up',
        },
      },
    };

    const result = await controller.check();
    expect(result).toEqual(expected);
  });
});
