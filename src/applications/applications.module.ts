import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';

@Module({
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
  exports: [ApplicationsService],
  imports: [UsersModule],
})
export class ApplicationsModule {}
