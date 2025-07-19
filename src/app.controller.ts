import { Controller, Get, HttpCode } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './shared/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('/healthz')
  @HttpCode(200)
  check() {
    return { status: 'ok' };
  }
}
