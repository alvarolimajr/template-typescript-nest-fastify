/* istanbul ignore file */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingModule } from './common';
import { LoggingInterceptor } from './common/logging/logging.interceptor';
import { ExamplesModule } from './examples/examples.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggingModule,
    HealthModule,
    ExamplesModule, // TODO Remove the Examples Module (ExamplesModule)
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
