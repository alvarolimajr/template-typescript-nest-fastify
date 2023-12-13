import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

/**
 * User DTO Example, NOT USE IT IN PRODUCTION.
 */
@Exclude()
export class UserDto {
  @Expose()
  @ApiProperty()
  readonly id: number;

  @Expose()
  @ApiProperty()
  readonly name: string;

  @Expose()
  @ApiProperty()
  readonly email: string;

  /**
   * @param partial
   */
  constructor(partial?: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
