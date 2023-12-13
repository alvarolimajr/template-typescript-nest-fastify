import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Address } from './address.interface';
import { AddressDto } from './dto/address.dto';
import { AddressMapper } from './mapper/address.mapper';

/**
 * Address Service.
 */
@Injectable()
export class AddressService {
  private readonly logger = new Logger(AddressService.name);

  /**
   * @param configService
   * @param httpService
   */
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  /**
   * Find a address information by zip code.
   *
   * @param zipCode
   * @throws NotFoundException if the address not found
   */
  public findByZipCode(zipCode: string): Promise<AddressDto> {
    const endpoint = this.configService.get<string>('API_CEP_ENDPOINT');
    const address = this.httpService
      .get<Address>(`${endpoint}/${zipCode}/json`)
      .pipe(
        map((response) => AddressMapper.toDto(response.data)),
        catchError((e) => {
          this.logger.error(e);
          throw new NotFoundException(`Zip Code ${zipCode} not found`);
        }),
      );

    return lastValueFrom(address);
  }
}
