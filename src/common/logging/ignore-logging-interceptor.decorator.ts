/* istanbul ignore file */

import { applyDecorators, SetMetadata } from '@nestjs/common';
import { IGNORE_LOGGING_INTERCEPTOR } from './logging.constants';

export function IgnoreLoggingInterceptor(): MethodDecorator {
  return applyDecorators(SetMetadata(IGNORE_LOGGING_INTERCEPTOR, true));
}
