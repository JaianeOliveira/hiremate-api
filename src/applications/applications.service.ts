import { BadRequestException, Injectable } from '@nestjs/common';
import { ApplicationStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
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

    return createdApplication;
  }

  async findAll(userId: string) {
    return await this.prisma.application.findMany({ where: { userId } });
  }

  findOne(id: number) {
    return `This action returns a #${id} application`;
  }

  update(id: number, updateApplicationDto: UpdateApplicationDto) {
    return `This action updates a #${id} application`;
  }

  remove(id: number) {
    return `This action removes a #${id} application`;
  }
}
