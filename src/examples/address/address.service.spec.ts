import { HttpService } from '@nestjs/axios';
import { HttpException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosResponse } from 'axios';
import { of, throwError } from 'rxjs';
import { Address } from './address.interface';
import { AddressService } from './address.service';
import { AddressMapper } from './mapper/address.mapper';

const mockHttpService = {
  get: jest.fn(() => of(null)),
};

describe('AddressService', () => {
  let service: AddressService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        AddressService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<AddressService>(AddressService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an address by zip code', async () => {
    const address: Address = {
      cep: '80740-020',
      logradouro: 'Rua Desembargador Augusto Guimarães Cortes',
      bairro: 'Campina do Siqueira',
      localidade: 'Curitiba',
      uf: 'PR',
      ibge: '4106902',
      ddd: '41',
    };

    const result: AxiosResponse<Address> = {
      data: { ...address },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { headers: undefined },
    };

    jest.spyOn(httpService, 'get').mockImplementationOnce(() => of(result));
    expect(await service.findByZipCode('80740020')).toEqual(
      AddressMapper.toDto(address),
    );
  });

  it('throws API error', async () => {
    const error = {
      message: '400 Bad Request',
      response: { status: 400 },
    };

    jest
      .spyOn(httpService, 'get')
      .mockImplementationOnce(() => throwError(() => error));
    await expect(service.findByZipCode(null)).rejects.toThrowError(
      HttpException,
    );
  });
});
