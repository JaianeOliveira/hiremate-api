import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';

@Injectable()
export class AccountsService {
  constructor(private readonly prisma: PrismaService) {}

  async linkinAccount(createAccountDto: CreateAccountDto) {
    return await this.prisma.account.create({
      data: {
        provider: createAccountDto.provider,
        providerAccountId: createAccountDto.providerAccountId,
        userId: createAccountDto.userId,
        type: createAccountDto.type,
        access_token: createAccountDto.accessToken,
        expires_at: createAccountDto.expiresAt,
        token_type: createAccountDto.tokenType,
        scope: createAccountDto.scope,
        id_token: createAccountDto.idToken,
        session_state: createAccountDto.sessionState,
      },
    });
  }
}
