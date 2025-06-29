import { Module } from '@nestjs/common';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
  ],
})
export class ApplicationsModule {}
