import { HttpException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { AddressDto } from './dto/address.dto';

jest.mock('./address.service');

describe('AddressController', () => {
  let controller: AddressController;
  let service: AddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddressController],
      providers: [AddressService],
    }).compile();

    controller = module.get<AddressController>(AddressController);
    service = module.get<AddressService>(AddressService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an address by zip code', async () => {
    const zipCode = '80740-020';
    const expected = new AddressDto({
      zipCode,
      streetAddress: 'Rua Desembargador Augusto Guimarães Cortes',
      district: 'Campina do Siqueira',
      city: 'Curitiba',
      stateCode: 'PR',
    });

    jest
      .spyOn(service, 'findByZipCode')
      .mockImplementation(async (zipCode: string) => ({
        ...expected,
        zipCode,
      }));

    const result = await controller.findByZipCode(zipCode);
    expect(result).toEqual(expected);
  });

  it('should be a NotFoundException if zip code is null', async () => {
    await expect(controller.findByZipCode(null)).rejects.toThrowError(
      NotFoundException,
    );
  });

  it('should be a NotFoundException', async () => {
    jest.spyOn(service, 'findByZipCode').mockResolvedValue(null);
    await expect(controller.findByZipCode('00000000')).rejects.toThrowError(
      NotFoundException,
    );
  });

  it('should be a HttpException', async () => {
    jest.spyOn(service, 'findByZipCode').mockImplementation(() => {
      throw new HttpException('400 Bad Request', 400);
    });
    await expect(controller.findByZipCode('1234567890')).rejects.toThrowError(
      HttpException,
    );
  });
});
