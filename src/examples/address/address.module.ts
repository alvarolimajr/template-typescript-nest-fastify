/* istanbul ignore file */

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';

/**
 * Address Module.
 */
@Module({
  imports: [HttpModule],
  controllers: [AddressController],
  providers: [AddressService],
})
export class AddressModule {}
