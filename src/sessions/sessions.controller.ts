import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { SessionsService } from './sessions.service';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  createSession(@Body() createSessionDto: CreateSessionDto) {
    return this.sessionsService.createSession(createSessionDto);
  }

  @Get(':sessionToken')
  getSessionAndUser(@Param('sessionToken') sessionToken: string) {
    return this.sessionsService.getSessionAndUser(sessionToken);
  }

  @Patch(':sessionToken')
  update(
    @Param('sessionToken') sessionToken: string,
    @Body() updateSessionDto: UpdateSessionDto,
  ) {
    return this.sessionsService.update(sessionToken, updateSessionDto);
  }

  @Delete(':sessionToken')
  remove(@Param('sessionToken') sessionToken: string) {
    return this.sessionsService.remove(sessionToken);
  }
}
