/* istanbul ignore file */

import { Module } from '@nestjs/common';
import { AddressModule } from './address/address.module';
import { UsersModule } from './users/users.module';

/**
 * Example Module.
 */
@Module({
  imports: [AddressModule, UsersModule],
})
export class ExamplesModule {}
