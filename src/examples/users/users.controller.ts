import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorResponseDto, TransformInterceptor } from '../../common';
import { CreateUserDto, UpdateUserDto, UserDto } from './dto';
import { UsersService } from './users.service';

/**
 * User Controller Example, NOT USE IT IN PRODUCTION.
 */
@ApiTags('examples/users')
@Controller('examples/users')
export class UsersController {
  /**
   * @param usersService
   */
  constructor(private readonly usersService: UsersService) {}

  /**
   *
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(new TransformInterceptor(UserDto))
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Return all users.',
    type: UserDto,
    isArray: true,
  })
  public async findAll(): Promise<UserDto[]> {
    return this.usersService.findAll();
  }

  /**
   * @param id
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(new TransformInterceptor(UserDto))
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({
    status: 200,
    description: 'Return user by id.',
    type: UserDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
    type: ErrorResponseDto,
  })
  public async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserDto> {
    if (!id || id <= 0) {
      throw new NotFoundException();
    }

    const user = await this.usersService.findById(id);

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return user;
  }

  /**
   * @param user
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(new TransformInterceptor(UserDto))
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: UserDto,
  })
  public async create(@Body() user: CreateUserDto): Promise<UserDto> {
    return this.usersService.create(user);
  }

  /**
   * @param id
   * @param user
   */
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Update the user' })
  @ApiResponse({
    status: 204,
    description: 'The user has been successfully updated.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
    type: ErrorResponseDto,
  })
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: UpdateUserDto,
  ) {
    await this.usersService.update(id, user);
  }

  /**
   * @param id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete the user' })
  @ApiResponse({
    status: 204,
    description: 'The user has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
    type: ErrorResponseDto,
  })
  public async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    if (!id || id <= 0) {
      throw new NotFoundException();
    }
    await this.usersService.delete(id);
  }
}
