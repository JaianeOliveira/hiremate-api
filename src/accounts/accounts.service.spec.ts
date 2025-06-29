import { TestingModule, Test } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';

describe('AccountsService', () => {
  let service: AccountsService;
  let prisma: { account: { create: jest.Mock } };

  beforeEach(async () => {
    const mockPrisma = { account: { create: jest.fn() } };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
    prisma = module.get<PrismaService>(PrismaService) as any;
    jest.clearAllMocks();
  });

  describe('linkinAccount', () => {
    it('should create and return an account', async () => {
      const dto: CreateAccountDto = {
        provider: 'google',
        providerAccountId: 'prov123',
        userId: 'user1',
        type: 'oauth',
        accessToken: 'token',
        expiresAt: 123456,
        tokenType: 'Bearer',
        scope: 'scope',
        idToken: 'idtoken',
        sessionState: 'state',
      };
      const created = { id: 'acc1', ...dto };
      prisma.account.create.mockResolvedValue(created);

      const result = await service.linkinAccount(dto);
      expect(prisma.account.create).toHaveBeenCalledWith({
        data: {
          provider: dto.provider,
          providerAccountId: dto.providerAccountId,
          userId: dto.userId,
          type: dto.type,
          access_token: dto.accessToken,
          expires_at: dto.expiresAt,
          token_type: dto.tokenType,
          scope: dto.scope,
          id_token: dto.idToken,
          session_state: dto.sessionState,
        },
      });
      expect(result).toEqual(created);
    });
  });
});
