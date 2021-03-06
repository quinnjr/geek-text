import { UtilityService } from './../utility/utility.service';
import { Body, Controller, Delete, Get, Header, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Public } from '../public.decorator';
import { Roles, Role } from '../roles.decorator';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    /**
   * Users controller constructor
   *
   * @param $usersService The database connection to the `users` table
   */
  constructor(
    private readonly $utilityService: UtilityService,
    private readonly $usersService: UsersService
  ) {}

  /**
   * GET request to find all records in the `users` table.
   *
   * @param query Query parameters to alter the `WHERE` SQL clause
   */
  @Get()
  @Header('Cache-Control', 'max-age=0, s-max-age=3600, proxy-revalidate')
  @Roles(Role.Admin)
  public async findAll(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('cursor') cursor?: Prisma.UserWhereUniqueInput,
    @Query('where') where?: Prisma.UserWhereInput,
    @Query('orderBy') orderBy?: Prisma.UserOrderByInput,
    @Query('select') select?: Prisma.UserSelect
  ): Promise<User[]> {
    if(cursor) cursor = await this.$utilityService.convertBtoO(cursor as string);
    if(where) where = await this.$utilityService.convertBtoO(where as string);
    if(orderBy) orderBy = await this.$utilityService.convertBtoO(orderBy as string);
    if(select) select = await this.$utilityService.convertBtoO(select as string);
    const query = { skip, take, cursor, where, orderBy, select };
    return this.$usersService.findAll(query);
  }

  /**
   * GET request to find a User by a string UUID
   *
   * @param id The UUID of the requested User
   */
  @Get(':id')
  @Header('Cache-Control', 'max-age=0, s-max-age=3600, proxy-revalidate')
  public async findOne(
    @Param('id') id: string,
    @Query('select') select?: Prisma.UserSelect
  ): Promise<User | null> {
    if(select) select = await this.$utilityService.convertBtoO<Prisma.UserSelect>(select as string);
    const query = { where: { id: id }, select };
    return this.$usersService.findOne(query);
  }

  /**
   * POST request to create a new User in the `users` table
   *
   * @param postData The Book data to be created
   */
  @Post('')
  @Public()
  public async create(
    @Body() postData: {
      email: string;
      password: string;
    }
  ): Promise<User> {
    return this.$usersService.create(postData);
  }

  /**
   * PUT request to update a User in the `users` table
   *
   * @param id The UUID of the User to be updated
   * @param bookData The updated information of the Book
   */
  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() postData: User
  ): Promise<User> {
    return this.$usersService.update({
      where: { id: id } as Prisma.UserWhereUniqueInput,
      data: postData
    });
  }

  /**
   * DELETE request to remove a User from the `users` table
   *
   * @param id The UUID of the User to be removed
   */
  @Delete(':id')
  @Roles(Role.Admin)
  public async delete(@Param('id') id: string): Promise<User> {
    return this.$usersService.delete({id: id} as Prisma.UserWhereUniqueInput);
  }
}
