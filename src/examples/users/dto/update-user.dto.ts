import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

/**
 * Update User DTO Example, NOT USE IT IN PRODUCTION.
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {}
