import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { webcrypto } from 'crypto';
import { Request } from 'express';
import { compactDecrypt } from 'jose';
import { PrismaService } from 'src/prisma/prisma.service';

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET!;
const INFO = new TextEncoder().encode('NextAuth.js Generated Encryption Key');

declare module 'express-serve-static-core' {
  interface Request {
    user?: any;
  }
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async deriveKey(secret: string): Promise<Uint8Array> {
    const ikm = new TextEncoder().encode(secret);
    const subtle = (webcrypto as any).subtle as SubtleCrypto;
    const rawKey = await subtle.importKey('raw', ikm, 'HKDF', false, [
      'deriveKey',
    ]);
    const aesKey = await subtle.deriveKey(
      { name: 'HKDF', hash: 'SHA-256', salt: new Uint8Array(0), info: INFO },
      rawKey,
      { name: 'AES-GCM', length: 256 },
      true,
      ['decrypt'],
    );
    return new Uint8Array(await subtle.exportKey('raw', aesKey));
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<Request>();
    const authHeader = req.headers['authorization'];

    let token: string | undefined = undefined;
    if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token && req.headers.cookie) {
      const cookies = req.headers.cookie
        .split(';')
        .map((c) => c.trim())
        .reduce<Record<string, string>>((acc, cur) => {
          const [k, v] = cur.split('=');
          acc[k] = v;
          return acc;
        }, {});
      token =
        cookies['__Secure-next-auth.session-token'] ??
        cookies['next-auth.session-token'];
    }

    if (!token) {
      throw new UnauthorizedException('Token não encontrado');
    }

    try {
      const key = await this.deriveKey(NEXTAUTH_SECRET);
      const { plaintext } = await compactDecrypt(token, key);
      const payload = JSON.parse(new TextDecoder().decode(plaintext));

      const user = payload;

      const dbUser = await this.prisma.user.findUnique({
        where: { email: user.email },
      });

      req.user = dbUser;

      return true;
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}
