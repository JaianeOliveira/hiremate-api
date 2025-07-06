import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CompactEncrypt } from 'jose';
import { PrismaService } from 'src/prisma/prisma.service';
import { EnvironmentGuard } from 'src/shared/guards/enviroment.guard';
import { deriveKey } from 'src/shared/utils/jwe';

@Controller('auth')
export class AuthController {
  constructor(private prisma: PrismaService) {}

  @Get('token/:email')
  @UseGuards(EnvironmentGuard)
  async getToken(@Param('email') email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    const payload = {
      name: user.name,
      email: user.email,
      sub: user.id,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 dias
    };

    const key = await deriveKey(process.env.NEXTAUTH_SECRET!);
    const jwe = await new CompactEncrypt(
      new TextEncoder().encode(JSON.stringify(payload)),
    )
      .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
      .encrypt(key);

    return { token: jwe };
  }
}
