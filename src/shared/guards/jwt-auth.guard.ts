import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
    };
  }
}

import { JwtService } from '@nestjs/jwt';

import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { parse } from 'cookie'; // npm i cookie
import { UsersService } from 'src/users/users.service';
import { COOKIE_ACCESS_TOKEN } from '../constants/cookies';
import { ExceptionsGlobalMessages } from '../constants/exceptions-global-messages';
import { responseDescriptions } from '../constants/response-descriptions';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger: Logger;

  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
    private configService: ConfigService,
    private reflector: Reflector,
  ) {
    this.logger = new Logger(JwtAuthGuard.name, { timestamp: true });
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (isPublic) return true;

    const req = ctx.switchToHttp().getRequest<Request>();
    const token = this.extractToken(req);

    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
      });

      const dbUser = await this.userService.getUser({ id: payload.sub });

      if (!dbUser) {
        throw new UnauthorizedException('User not found');
      }

      req.user = { id: dbUser.id };
      console.log(dbUser);
      this.logger.log(`Authorized user - ${dbUser.id}`, JwtAuthGuard.name);

      return true;
    } catch (error) {
      this.logger.error(error.message, error, { ctx });

      throw new UnauthorizedException(ExceptionsGlobalMessages.UNAUTHORIDED, {
        description: responseDescriptions.INVALID_AUTH,
      });
    }
  }

  private extractToken(req: Request): string | undefined {
    const auth = req.headers.authorization;
    if (auth?.startsWith('Bearer ')) return auth.split(' ')[1];

    if (req.cookies[COOKIE_ACCESS_TOKEN])
      return req.cookies[COOKIE_ACCESS_TOKEN];

    const raw = req.headers.cookie;
    if (raw) {
      const parsed = parse(raw);
      return parsed[COOKIE_ACCESS_TOKEN];
    }
  }
}
