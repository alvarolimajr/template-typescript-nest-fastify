import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';

@Injectable()
export class AppHealthIndicator extends HealthIndicator {
  /**
   *
   * @param key
   * @returns
   */
  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const isHealthy = true;
    return this.getStatus(key, isHealthy);
  }
}
