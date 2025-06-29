import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from './users.service';

const mockPrisma = {
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  account: {
    findUnique: jest.fn(),
  },
};

describe('UsersService', () => {
  let service: UsersService;
  let prisma: typeof mockPrisma;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService) as any;

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and return a user', async () => {
      const dto = {
        id: '1',
        email: 'a@b.com',
        name: 'Alice',
        image: 'img.png',
      };
      const created = { ...dto };
      prisma.user.create.mockResolvedValue(created);

      const result = await service.create(dto);
      expect(prisma.user.create).toHaveBeenCalledWith({ data: dto });
      expect(result).toEqual(created);
    });
  });

  describe('getUser', () => {
    it('should return user by id', async () => {
      const user = { id: '1', email: 'a@b.com', name: 'Alice' };
      prisma.user.findUnique.mockResolvedValue(user);

      const result = await service.getUser({ id: '1' });
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(user);
    });

    it('should return user by email', async () => {
      const user = { id: '1', email: 'a@b.com', name: 'Alice' };
      prisma.user.findUnique.mockResolvedValue(user);

      const result = await service.getUser({ email: 'a@b.com' });
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'a@b.com' },
      });
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.getUser({ id: 'x' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getUserByAccount', () => {
    it('should return user for existing account', async () => {
      const account = { user: { id: '1', email: 'a@b.com' } };
      prisma.account.findUnique.mockResolvedValue(account);

      const result = await service.getUserByAccount('google', '123');
      expect(prisma.account.findUnique).toHaveBeenCalledWith({
        where: {
          provider_providerAccountId: {
            provider: 'google',
            providerAccountId: '123',
          },
        },
        include: { user: true },
      });
      expect(result).toEqual(account.user);
    });

    it('should throw NotFoundException if account not found', async () => {
      prisma.account.findUnique.mockResolvedValue(null);
      await expect(service.getUserByAccount('x', 'y')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update and return the user', async () => {
      const dto = { email: 'new@b.com', name: 'Bob', image: 'pic.png' };
      const updated = { id: '1', ...dto };
      prisma.user.update.mockResolvedValue(updated);

      const result = await service.update('1', dto);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: dto,
      });
      expect(result).toEqual(updated);
    });

    it('should throw NotFoundException if update returns null', async () => {
      prisma.user.update.mockResolvedValue(null);
      await expect(
        service.update('1', { email: 'x', name: 'y', image: 'z' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete the user and return message', async () => {
      prisma.user.delete.mockResolvedValue({ id: '1' });

      const result = await service.remove('1');
      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual({ message: 'User deleted successfully' });
    });

    it('should throw NotFoundException if delete returns null', async () => {
      prisma.user.delete.mockResolvedValue(null);
      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
