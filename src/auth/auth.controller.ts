// auth/auth.controller.ts
import {
  Controller,
  Get,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { Throttle } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { COOKIE_ACCESS_TOKEN } from 'src/shared/constants/cookies';
import { ProviderAccountDataDTO } from 'src/shared/dto/provider-account-data.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@Throttle({ default: { ttl: 60, limit: 20 } })
export class AuthController {
  private readonly logger = new Logger(AuthController.name, {
    timestamp: true,
  });
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    try {
      const user = req.user as unknown as ProviderAccountDataDTO;

      const { access_token } = await this.authService.generateCredentials(user);

      res
        .cookie(COOKIE_ACCESS_TOKEN, access_token, {
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
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

  @Post('logout')
  logout(@Res() res: Response) {
    res
      .clearCookie(COOKIE_ACCESS_TOKEN, {
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
      })
      .redirect(process.env.CONSUMER_URL + '/auth/login');
  }
}
