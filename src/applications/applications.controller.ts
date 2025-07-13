import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ListApplicationsDto } from './dto/list-applications.dto';
import { ListCompaniesDto } from './dto/list-companies.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Controller('applications')
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  private readonly logger = new Logger(ApplicationsController.name, {
    timestamp: true,
  });
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  create(
    @Req() req: Request,
    @Body() createApplicationDto: CreateApplicationDto,
  ) {
    try {
      if (!req.user?.id) {
        throw new UnauthorizedException();
      }

      return this.applicationsService.create(createApplicationDto, req.user.id);
    } catch (error) {
      this.logger.error(
        'Cannot create user',
        ApplicationsController.prototype.create,
        { error },
      );
    }
  }

  @Get()
  async list(@Req() request: Request, @Query() query: ListApplicationsDto) {
    if (!request.user?.id) {
      throw new UnauthorizedException();
    }

    return await this.applicationsService.findAll(request.user.id, query);
  }

  @Get('companies')
  listCompanies(@Req() request: Request, @Query() query: ListCompaniesDto) {
    if (!request.user?.id) {
      throw new UnauthorizedException();
    }

    return this.applicationsService.listCompanies(request.user.id, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applicationsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
  ) {
    if (!request.user?.id) {
      throw new UnauthorizedException();
    }
    return this.applicationsService.update(
      id,
      updateApplicationDto,
      request.user.id,
    );
  }

  @Delete(':id')
  remove(@Req() request: Request, @Param('id') id: string) {
    if (!request.user?.id) {
      throw new UnauthorizedException();
    }
    return this.applicationsService.remove(id, request.user.id);
  }
}
