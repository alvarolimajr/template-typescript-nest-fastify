/* istanbul ignore file */

import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { AppHealthIndicator } from './app.health';
import { HealthController } from './health.controller';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [AppHealthIndicator],
})
export class HealthModule {}
