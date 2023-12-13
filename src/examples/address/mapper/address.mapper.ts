import { Address } from '../address.interface';
import { AddressDto } from '../dto/address.dto';

export class AddressMapper {
  /**
   * Convert an Address to AddressDto.
   * @param address
   * @returns AddressDto
   */
  public static toDto(address: Address): AddressDto {
    if (!address) {
      return null;
    }

    return new AddressDto({
      zipCode: address.cep,
      streetAddress: address.logradouro,
      district: address.bairro,
      city: address.localidade,
      stateCode: address.uf,
    });
  }
}
