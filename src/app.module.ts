import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { ScheduleModule } from '@nestjs/schedule';
import { ApplicationsModule } from './applications/applications.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { SchedulerService } from './scheduler/scheduler.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    UsersModule,
    ApplicationsModule,
    ThrottlerModule.forRoot([{ ttl: 3600, limit: 1000 }]),
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [SchedulerService],
})
export class AppModule {}
