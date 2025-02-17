import { Injectable } from '@nestjs/common';
import {
  HealthIndicatorResult,
  HealthIndicatorService,
} from '@nestjs/terminus';

@Injectable()
export class AppHealthIndicator {
  constructor(
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  /**
   *
   * @param key
   * @returns
   */
  async isHealthy<const TKey extends string>(
    key: TKey,
  ): Promise<HealthIndicatorResult> {
    // Start the health indicator check for the given key
    const indicator = this.healthIndicatorService.check(key);
    return indicator.up();
  }
}
