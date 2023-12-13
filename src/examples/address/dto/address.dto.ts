import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class AddressDto {
  @Expose()
  @ApiProperty()
  readonly zipCode: string;

  @Expose()
  @ApiProperty()
  readonly streetAddress: string;

  @Expose()
  @ApiProperty()
  readonly district: string;

  @Expose()
  @ApiProperty()
  readonly city: string;

  @Expose()
  @ApiProperty()
  readonly stateCode: string;

  /**
   * @param partial
   */
  constructor(partial?: Partial<AddressDto>) {
    Object.assign(this, partial);
  }
}
