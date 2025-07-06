import { ApplicationStatus } from '@prisma/client';

export class CreateApplicationDto {
  jobTitle: string;
  companyName: string;
  status?: ApplicationStatus;
  applicationDate?: string;
  notes?: string;
  link?: string;
  contact?: string;
  feedback?: string;
  isTalentPool?: boolean;
}
