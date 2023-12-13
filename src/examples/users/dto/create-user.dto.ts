import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * Create User DTO Example, NOT USE IT IN PRODUCTION.
 */
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly password: string;

  /**
   * @param partial
   */
  constructor(partial?: Partial<CreateUserDto>) {
    Object.assign(this, partial);
  }
}
