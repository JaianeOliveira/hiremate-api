import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  getUser(@Query('id') id?: string, @Query('email') email?: string) {
    return this.usersService.getUser({ id, email });
  }

  @Get('by-account/:provider/:accountProviderId')
  getUserByAccount(
    @Param('provider') provider: string,
    @Param('accountProviderId') accountProviderId: string,
  ) {
    return this.usersService.getUserByAccount(provider, accountProviderId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
