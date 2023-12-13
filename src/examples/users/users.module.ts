/* istanbul ignore file */

import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

/**
 * User Module.
 */
@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
