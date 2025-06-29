import { TestingModule, Test } from '@nestjs/testing';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';

describe('AccountsController', () => {
  let controller: AccountsController;
  let service: { linkinAccount: jest.Mock };

  beforeEach(async () => {
    const mockService = { linkinAccount: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [{ provide: AccountsService, useValue: mockService }],
    }).compile();

    controller = module.get<AccountsController>(AccountsController);
    service = module.get<AccountsService>(AccountsService) as any;
    jest.clearAllMocks();
  });

  describe('linkinAccount', () => {
    it('should call service.linkinAccount and return result', async () => {
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
      const resultValue = { id: 'acc1', ...dto };
      service.linkinAccount.mockResolvedValue(resultValue);

      await expect(controller.linkinAccount(dto)).resolves.toEqual(resultValue);
      expect(service.linkinAccount).toHaveBeenCalledWith(dto);
    });

    it('should propagate errors from service.linkinAccount', async () => {
      service.linkinAccount.mockRejectedValue(new Error('Failed'));
      await expect(
        controller.linkinAccount({} as CreateAccountDto),
      ).rejects.toThrow('Failed');
    });
  });
});
