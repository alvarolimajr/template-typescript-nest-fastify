/* istanbul ignore file */

import { Module } from '@nestjs/common';
import nrWinstonEnricher from '@newrelic/winston-enricher';
import * as winston from 'winston';
import { IS_PRODUCTION } from '../../constants';
import { nestConsoleFormat, severity } from './winston.formats';
import { WinstonLogger } from './winston.logger';

/**
 * Default log level.
 */
const DEFAULT_LOG_LEVEL = 'error';

const newrelicFormatter = nrWinstonEnricher(winston);

@Module({
  providers: [
    {
      provide: WinstonLogger,
      useFactory: () => {
        return new WinstonLogger({
          level: process.env.LOG_LEVEL || DEFAULT_LOG_LEVEL,
          silent: process.env.LOG_SILENT === '1',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            severity({ upperCase: true }),
            newrelicFormatter(),
            IS_PRODUCTION ? winston.format.json() : nestConsoleFormat(),
          ),
          transports: [new winston.transports.Console()],
        });
      },
    },
  ],
  exports: [WinstonLogger],
})
export class LoggingModule {}
