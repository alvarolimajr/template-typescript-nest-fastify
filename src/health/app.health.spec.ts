import { AppHealthIndicator } from './app.health';

describe('AppHealthIndicator', () => {
  it('should retrieve true as check value', async () => {
    const indicator: AppHealthIndicator = new AppHealthIndicator();

    expect(await indicator.isHealthy('app')).toMatchObject({
      app: { status: 'up' },
    });
  });
});
