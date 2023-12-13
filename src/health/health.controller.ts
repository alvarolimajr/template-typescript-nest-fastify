import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { IgnoreLoggingInterceptor } from '../common';
import { AppHealthIndicator } from './app.health';

@Controller(['healthcheck', 'health'])
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly appHealthIndicator: AppHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Get application liveness' })
  @IgnoreLoggingInterceptor()
  public async check() {
    return this.health.check([
      async () => this.appHealthIndicator.isHealthy('app'),
    ]);
  }
}
