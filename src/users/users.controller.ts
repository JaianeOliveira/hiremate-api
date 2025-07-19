import { Controller, Get, Req, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@Req() request: Request) {
    if (!request.user?.id) {
      throw new UnauthorizedException();
    }

    return this.usersService.getUser({ id: request.user.id });
  }
}
