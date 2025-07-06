import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class EnvironmentGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const env = process.env.NODE_ENV;

    if (env !== 'development' && env !== 'test') {
      throw new ForbiddenException(
        'Este endpoint só está disponível em dev e test',
      );
    }
    return true;
  }
}
