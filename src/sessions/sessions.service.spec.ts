import { NotFoundException } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { SessionsService } from './sessions.service';

const mockPrisma = {
  session: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('SessionsService', () => {
  let service: SessionsService;
  let prisma: typeof mockPrisma;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<SessionsService>(SessionsService);
    prisma = module.get<PrismaService>(PrismaService) as any;
    jest.clearAllMocks();
  });

  describe('createSession', () => {
    it('should create and return a session', async () => {
      const dto: CreateSessionDto = {
        userId: 'user1',
        sessionToken: 'token123',
        expires: new Date(),
      };
      const created = { id: '1', ...dto };
      prisma.session.create.mockResolvedValue(created);

      const result = await service.createSession(dto);
      expect(prisma.session.create).toHaveBeenCalledWith({ data: dto });
      expect(result).toEqual(created);
    });
  });

  describe('getSessionAndUser', () => {
    it('should return session and user when found', async () => {
      const mockSession = {
        sessionToken: 'token123',
        userId: 'user1',
        expires: new Date(),
        user: { id: 'user1', email: 'test@example.com' },
      };
      prisma.session.findUnique.mockResolvedValue(mockSession);

      const result = await service.getSessionAndUser('token123');
      expect(prisma.session.findUnique).toHaveBeenCalledWith({
        where: { sessionToken: 'token123' },
        include: { user: true },
      });
      expect(result).toEqual({
        session: {
          sessionToken: mockSession.sessionToken,
          userId: mockSession.userId,
          expires: mockSession.expires,
        },
        user: mockSession.user,
      });
    });

    it('should throw NotFoundException if session not found', async () => {
      prisma.session.findUnique.mockResolvedValue(null);
      await expect(service.getSessionAndUser('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it.todo('should update and return the session');
  });

  describe('remove', () => {
    it('should delete the session and return message', async () => {
      prisma.session.delete.mockResolvedValue({ sessionToken: 'token123' });

      const result = await service.remove('token123');
      expect(prisma.session.delete).toHaveBeenCalledWith({
        where: { sessionToken: 'token123' },
      });
      expect(result).toEqual({ message: 'Session deleted successfully' });
    });

    it('should throw Error if session not found', async () => {
      prisma.session.delete.mockResolvedValue(null);
      await expect(service.remove('token123')).rejects.toThrowError(
        'Session not found',
      );
    });
  });
});
