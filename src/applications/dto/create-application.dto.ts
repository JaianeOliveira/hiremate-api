import { ApplicationStatus } from '@prisma/client';
import dayjs from 'dayjs';

export class CreateApplicationDto {
  userId: string;
  jobTitle: string;
  companyName: string;
  status?: ApplicationStatus = ApplicationStatus.SENT;
  applicationDate?: Date = dayjs().toDate();
  notes?: string;
  link?: string;
  contact?: string;
  feedback?: string;
  isTalentPool?: boolean = false;
}
