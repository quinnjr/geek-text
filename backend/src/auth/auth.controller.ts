import { Body, Controller, Delete, Get, Header, Param, Post, Put, Request, Query, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

import { LocalAuth } from './dto/local-auth';

@Controller('auth')
export class AuthController {
  /**
   * Auth controller constructor
   *
   * @param $authService The Authentication service
   */
  constructor(
    private readonly $authService: AuthService
  ) {}

  /**
   * Logs a user in to the application using BasicAuth
   *
   * @param email The user's email
   * @param password The user's password
   */
  @Post('login')
  @UseGuards(LocalAuthGuard)
  public async login(
    @Body() localAuth: LocalAuth
  ): Promise<any> {
    return this.$authService.login(localAuth.email, localAuth.password);
  }

  /**
   * @TODO
   * Refreshes an expired but valid JWT if the expiration occurs within a set time period.
   */
  @Post('refresh-token')
  @UseGuards(JwtAuthGuard)
  public async refreshToken(): Promise<any> {

  }
}
