import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorResponseDto, TransformInterceptor } from '../../common';
import { AddressService } from './address.service';
import { AddressDto } from './dto/address.dto';

/**
 * Address Controller.
 */
@ApiTags('examples/address')
@Controller('examples/address')
export class AddressController {
  private readonly logger = new Logger(AddressController.name);

  /**
   * @param addressService
   */
  constructor(private readonly addressService: AddressService) {}

  /**
   * @param zipCode
   */
  @Get(':zipCode')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(new TransformInterceptor(AddressDto))
  @ApiOperation({ summary: 'Get address information by zip code.' })
  @ApiResponse({
    status: 200,
    description: 'Return address information.',
    type: AddressDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Address not found',
    type: ErrorResponseDto,
  })
  public async findByZipCode(
    @Param('zipCode') zipCode: string,
  ): Promise<AddressDto> {
    this.logger.debug(`Finding by ${zipCode}`);

    if (!zipCode) {
      throw new NotFoundException();
    }

    const address = await this.addressService.findByZipCode(zipCode);

    this.logger.log({
      address,
      message: 'Address found',
    });

    if (!address?.streetAddress) {
      throw new NotFoundException(`Zip Code ${zipCode} not found`);
    }

    return address;
  }
}
