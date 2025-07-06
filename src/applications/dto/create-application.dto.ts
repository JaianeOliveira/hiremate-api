import { ApplicationStatus } from '@prisma/client';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  @MinLength(1)
  jobTitle: string;

  @IsString()
  @MinLength(1)
  companyName: string;

  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;

  @IsOptional()
  @IsDateString()
  applicationDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;

  @IsOptional()
  @IsUrl({ require_protocol: true })
  link?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  contact?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  feedback?: string;

  @IsOptional()
  @IsBoolean()
  isTalentPool?: boolean;
}
