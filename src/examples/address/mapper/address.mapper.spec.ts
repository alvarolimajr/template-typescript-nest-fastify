import { Address } from '../address.interface';
import { AddressDto } from '../dto/address.dto';
import { AddressMapper } from './address.mapper';

describe('AddressMapper', () => {
  it('should be null', () => {
    expect(AddressMapper.toDto(null)).toBeNull();
  });

  it('should mapper an address dto', () => {
    const address: Address = {
      cep: '80740-020',
      logradouro: 'Rua Desembargador Augusto Guimarães Cortes',
      bairro: 'Campina do Siqueira',
      localidade: 'Curitiba',
      uf: 'PR',
      ibge: '4106902',
      ddd: '41',
    };

    expect(AddressMapper.toDto(address)).toEqual(
      new AddressDto({
        zipCode: address.cep,
        streetAddress: address.logradouro,
        district: address.bairro,
        city: address.localidade,
        stateCode: address.uf,
      }),
    );
  });
});
