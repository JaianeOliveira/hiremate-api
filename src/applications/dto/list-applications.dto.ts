import { ApplicationStatus } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginateDto } from 'src/shared/dto/paginate.dto';

export class ListApplicationsDto extends PaginateDto {
  @IsOptional()
  @IsArray()
  @IsEnum(ApplicationStatus, { each: true })
  status?: ApplicationStatus[];

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsBoolean()
  isTalentPool?: boolean;
}
