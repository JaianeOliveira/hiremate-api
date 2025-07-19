// auth/auth.controller.ts
import {
  Controller,
  Get,
  Logger,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { Throttle } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { COOKIE_ACCESS_TOKEN } from 'src/shared/constants/cookies';
import { Public } from 'src/shared/decorators/public.decorator';
import { ProviderAccountDataDTO } from 'src/shared/dto/provider-account-data.dto';
import { EnvironmentGuard } from 'src/shared/guards/enviroment.guard';
import { AuthService } from './auth.service';

@Controller('auth')
@Throttle({ default: { ttl: 60, limit: 20 } })
export class AuthController {
  private readonly logger: Logger;
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    this.logger = new Logger(AuthController.name, {
      timestamp: true,
    });
  }

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {}

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    try {
      const user = req.user as unknown as ProviderAccountDataDTO;

      const { access_token } = await this.authService.generateCredentials(user);

      const isProduction = process.env.NODE_ENV === 'production';

      res
        .cookie(COOKIE_ACCESS_TOKEN, access_token, {
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          domain: isProduction ? '.hiremate.jaianeoliveira.com' : undefined,
          maxAge: 24 * 60 * 60 * 1000, // 1 dia
        })
        .redirect(`${this.configService.get('CONSUMER_URL')}/auth/login`);
    } catch (error) {
      this.logger.error(
        'Cannot authenticate user',
        AuthController.prototype.googleCallback,
        { error },
      );
      res.redirect(`${this.configService.get('CONSUMER_URL')}/auth/login`);
    }
  }

  @Public()
  @Post('logout')
  logout(@Res() res: Response) {
    const isProduction = process.env.NODE_ENV === 'production';

    res
      .clearCookie(COOKIE_ACCESS_TOKEN, {
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
        domain: isProduction ? '.hiremate.jaianeoliveira.com' : undefined,
      })
      .redirect(process.env.CONSUMER_URL + '/auth/logout');
  }

  @Public()
  @UseGuards(EnvironmentGuard)
  @Post('token')
  getToken(@Query('email') email: string) {
    return this.authService.getToken(email);
  }
}
