import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ApplicationStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { responseDescriptions } from 'src/shared/response-descriptions';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ListApplicationsDto } from './dto/list-applications.dto';
import { ListCompaniesDto } from './dto/list-companies.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateApplicationDto, userId: string) {
    const requiredFields = ['jobTitle', 'companyName'];

    if (!requiredFields.every((field) => Object.keys(data).includes(field))) {
      throw new BadRequestException('Missing required fields');
    }

    const {
      jobTitle,
      companyName,
      applicationDate,
      contact,
      feedback,
      isTalentPool,
      link,
      notes,
      status,
    } = data;

    const currentTime = new Date();
    const newApplication = {
      jobTitle,
      companyName,
      applicationDate: applicationDate ?? currentTime,
      status: status ?? ApplicationStatus.SENT,
      isTalentPool: isTalentPool ?? false,
      contact,
      feedback,
      link,
      notes,
      userId,
    };

    const createdApplication = await this.prisma.application.create({
      data: newApplication,
    });

    return { data: createdApplication };
  }

  async findAll(userId: string, query: ListApplicationsDto) {
    const { page = 1, limit = 10, status, isTalentPool, company } = query;
    const skip = (page - 1) * limit;

    const filters = {
      userId,
      AND: [
        {
          status: {
            in: status,
          },
        },
        {
          isTalentPool: {
            equals: isTalentPool,
          },
        },
        {
          companyName: {
            in: company,
          },
        },
      ],
    };

    const [items, total] = await Promise.all([
      this.prisma.application.findMany({
        where: filters,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.application.count({
        where: filters,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: items,
      pagination: {
        page,
        limit,
        total_pages: totalPages,
        total,
      },
    };
  }

  async findOne(id: string) {
    const data = await this.prisma.application.findUnique({
      where: { id },
    });

    if (!data) {
      throw new NotFoundException('Candidatura não encontrada', {
        description: responseDescriptions.NOT_FOUND,
      });
    }

    return { data };
  }

  async update(
    id: string,
    updateApplicationDto: UpdateApplicationDto,
    userId: string,
  ) {
    const application = await this.prisma.application.findUnique({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException('Candidatura não encontrada', {
        description: responseDescriptions.NOT_FOUND,
      });
    }

    if (application.userId !== userId) {
      throw new UnauthorizedException(
        'Você não tem autorização para alterar essa candidatura',
        {
          description: responseDescriptions.UNAUTHORIZED,
        },
      );
    }

    const updatedApplication = await this.prisma.application.update({
      where: { id, AND: { userId } },
      data: updateApplicationDto,
    });

    return { data: updatedApplication };
  }

  async remove(id: string, userId: string) {
    const application = await this.prisma.application.findUnique({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException('Candidatura não encontrada', {
        description: responseDescriptions.NOT_FOUND,
      });
    }

    if (application.userId !== userId) {
      throw new UnauthorizedException(
        'Você não tem autorização para apagar essa candidatura',
        {
          description: responseDescriptions.UNAUTHORIZED,
        },
      );
    }

    const removed = await this.prisma.application.delete({
      where: { id, AND: { userId } },
    });

    return { data: removed };
  }

  async listCompanies(userId: string, data: ListCompaniesDto) {
    const rows = await this.prisma.application.findMany({
      where: {
        userId,
        AND: {
          status: { in: data.status },
          isTalentPool: { equals: data.isTalentPool },
        },
      },
      distinct: ['companyName'],
      select: {
        companyName: true,
      },
      orderBy: {
        companyName: 'asc',
      },
    });
    return { data: rows.map((r) => r.companyName) };
  }
}
