import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { responseDescriptions } from 'src/shared/response-descriptions';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Controller('applications')
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  create(
    @Req() req: Request,
    @Body() createApplicationDto: CreateApplicationDto,
  ) {
    if (!req.user.id) {
      throw new UnauthorizedException('User ID not found', {
        description: responseDescriptions.AUTH_NOT_PROVIDED,
      });
    }

    return this.applicationsService.create(createApplicationDto, req.user.id);
  }

  @Get()
  async list(@Req() request: Request) {
    if (!request.user.id) {
      throw new UnauthorizedException('User ID not found', {
        description: responseDescriptions.AUTH_NOT_PROVIDED,
      });
    }

    return await this.applicationsService.findAll(request.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applicationsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
  ) {
    return this.applicationsService.update(+id, updateApplicationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.applicationsService.remove(+id);
  }
}
