import { Injectable, NotFoundException } from '@nestjs/common';
import * as crypto from 'node:crypto';
import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './entities/user.entity';

/**
 * User Service Example, NOT USE IT IN PRODUCTION.
 */
@Injectable()
export class UsersService {
  /**
   * Users in memory
   * DO NOT USE IT IN PRODUCTION.
   */
  users: User[] = [];

  /**
   * Find all users.
   * @returns
   */
  public findAll(): Promise<User[]> {
    return Promise.resolve(this.users);
  }

  /**
   * Find user by ID.
   *
   * @param id
   * @returns
   */
  public findById(id: number): Promise<User> {
    const user = this.users.find((u) => u.id === id);
    return Promise.resolve(user);
  }

  /**
   * Create a new user.
   *
   * @param user
   * @returns
   */
  public create(user: CreateUserDto): Promise<User> {
    const id = crypto.getRandomValues(new Uint16Array(1))[0];

    const newUser = new User({
      ...user,
      id,
      createdAt: new Date(),
      updatedAt: null,
    });
    this.users.push(newUser);
    return Promise.resolve(newUser);
  }

  /**
   * Update the user by ID.
   *
   * @param id
   * @param user
   * @returns
   * @throws NotFoundException if User not found.
   */
  public update(id: number, user: UpdateUserDto): Promise<User> {
    const index = this.users.findIndex((u) => u.id === id);
    const loadedUser = this.users[index];

    if (!loadedUser) {
      return Promise.reject(new NotFoundException(`User ${id} not found.`));
    }

    const mergedUser = {
      ...loadedUser,
      ...user,
      updatedAt: new Date(),
    };

    this.users[index] = mergedUser;
    return Promise.resolve(mergedUser);
  }

  /**
   * Remove the user by ID.
   *
   * @param id
   */
  public delete(id: number): Promise<void> {
    const index = this.users.findIndex((u) => u.id === id);

    if (index < 0) {
      return Promise.reject(new NotFoundException(`User ${id} not found.`));
    }

    this.users.splice(index, 1);
    return Promise.resolve();
  }
}
