import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ApplicationsService } from '../applications/applications.service';

@Injectable()
export class SchedulerService {
  private readonly logger: Logger;

  constructor(private readonly applicationsService: ApplicationsService) {
    this.logger = new Logger(SchedulerService.name, {
      timestamp: true,
    });
  }

  @Cron('0 6 * * *', { name: 'archive-stale-applications' })
  async handleArchiveStaleApplications() {
    this.logger.log('Iniciando arquivamento de candidaturas estagnadas');
    await this.applicationsService.updateStatusesForAllUsers();
    this.logger.log('Arquivamento concluído');
  }
}
