import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto, UpdateUserDto, UserDto } from './dto';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call findAll() exactly once', async () => {
    const users = await controller.findAll();
    expect(users).toEqual([]);
  });

  it('should contain instances of entity', async () => {
    const user = new User({
      id: 1,
      name: 'José',
      email: 'jose@mail.com',
      password: '123456',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const userDto = new UserDto({
      id: 1,
      name: 'José',
      email: 'jose@mail.com',
    });

    jest.spyOn(service, 'findAll').mockImplementation(async () => [user]);

    const results = await controller.findAll();

    results.map((result) => {
      expect(result).toMatchObject(userDto);
    });
  });

  it('should return user by id', async () => {
    const id = 1;
    const user = new User({
      id,
      name: 'José',
      email: 'jose@mail.com',
      password: '123456',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const userDto = new UserDto({
      id,
      name: 'José',
      email: 'jose@mail.com',
    });

    jest
      .spyOn(service, 'findById')
      .mockImplementation(async (id: number) => ({ ...user, id }));

    const userById = await controller.findById(id);
    expect(userById.id).toEqual(id);
    expect(userById).toMatchObject(userDto);
  });

  it('should be a NotFoundException', async () => {
    jest.spyOn(service, 'findById').mockImplementation(async () => null);
    await expect(controller.findById(1)).rejects.toThrowError(
      NotFoundException,
    );
  });

  it('should call create() with DTO argument', async () => {
    const dto = new CreateUserDto({
      name: 'José',
      email: 'jose@mail.com',
      password: '123456',
    });

    const user = await controller.create(dto);

    expect(user).toMatchObject(dto);
  });

  it('should call update() with DTO argument', async () => {
    const dto = new UpdateUserDto({
      name: 'José',
      email: 'jose@mail.com',
      password: '123456',
    });

    const spy = jest
      .spyOn(service, 'update')
      .mockImplementation(
        async (id: number, dtoToUpdate: UpdateUserDto) =>
          ({ ...dtoToUpdate, id }) as User,
      );

    await controller.update(1, dto);

    expect(spy).toBeCalledWith(1, dto);
  });

  it('should be a NotFoundException [findById]', async () => {
    await expect(controller.findById(0)).rejects.toThrowError(
      NotFoundException,
    );
  });

  it('should be a NotFoundException [update]', async () => {
    await expect(controller.update(0, null)).rejects.toThrowError(
      NotFoundException,
    );
  });

  it('should be deleted', async () => {
    const spyOn = jest.spyOn(service, 'delete').mockResolvedValue();
    await controller.delete(1);
    expect(spyOn).toBeCalledTimes(1);
  });

  it('should be a NotFoundException [delete]', async () => {
    await expect(controller.delete(0)).rejects.toThrowError(NotFoundException);
  });
});
