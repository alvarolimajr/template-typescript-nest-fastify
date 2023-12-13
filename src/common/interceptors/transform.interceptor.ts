import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ClassTransformOptions, plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ClassType<T> {
  new (): T;
}

/**
 * An interceptor that convert data in the class type
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<Partial<T>, T> {
  constructor(
    private readonly classType: ClassType<T>,
    private readonly options?: ClassTransformOptions,
  ) {}

  /**
   *
   * @param _ context
   * @param next
   */
  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(map((data) => plainToInstance(this.classType, data, this.options)));
  }
}
