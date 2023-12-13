import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ErrorResponseDto {
  @Expose()
  @ApiProperty()
  readonly statusCode: number;

  @Expose()
  @ApiProperty()
  readonly message: string;

  @Expose()
  @ApiProperty()
  readonly timestamp: string;

  /**
   * @param partial
   */
  constructor(partial?: Partial<ErrorResponseDto>) {
    Object.assign(this, partial);
  }
}
