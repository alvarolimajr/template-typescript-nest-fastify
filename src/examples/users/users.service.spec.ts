import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an empty array', async () => {
    expect(await service.findAll()).toEqual([]);
  });

  it('should return all users', async () => {
    const user = new User({
      id: 1,
      name: 'José',
      email: 'jose@mail.com',
      password: '123456',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    jest.spyOn(service, 'findAll').mockResolvedValueOnce([user]);
    expect(await service.findAll()).toEqual([user]);
  });

  it('should return an user by id', async () => {
    const user = new User({
      id: 1,
      name: 'José',
      email: 'jose@mail.com',
      password: '123456',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    service.users = [user];

    expect(await service.findById(1)).toEqual(user);
  });

  it('should create a new user', async () => {
    const userDto = new CreateUserDto({
      name: 'José',
      email: 'jose@mail.com',
      password: '123456',
    });

    const user = await service.create(userDto);

    expect(user).toMatchObject(userDto);
    expect(user?.id).toBeDefined();
  });

  it('should update an user', async () => {
    const user = new User({
      id: 1,
      name: 'José',
      email: 'jose@mail.com',
      password: '123456',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const userDto = new UpdateUserDto({
      name: 'José 2',
      email: 'jose3@mail.com',
      password: '1234567',
    });

    service.users = [user];

    const updatedUser = await service.update(1, userDto);

    expect(updatedUser).toMatchObject(userDto);
  });

  it('should be a NotFoundException', async () => {
    await expect(service.update(0, null)).rejects.toThrowError(
      NotFoundException,
    );
  });

  it('should delete an user', async () => {
    const user = new User({
      id: 1,
      name: 'José',
      email: 'jose@mail.com',
      password: '123456',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    service.users = [user];

    await service.delete(1);

    expect(service.users).toHaveLength(0);
  });

  it('should be a NotFoundException', async () => {
    await expect(service.delete(0)).rejects.toThrowError(NotFoundException);
  });
});
