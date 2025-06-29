import { NotFoundException } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';

const mockService = {
  createSession: jest.fn(),
  getSessionAndUser: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('SessionsController', () => {
  let controller: SessionsController;
  let service: typeof mockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionsController],
      providers: [{ provide: SessionsService, useValue: mockService }],
    }).compile();

    controller = module.get<SessionsController>(SessionsController);
    service = module.get<SessionsService>(SessionsService) as any;
    jest.clearAllMocks();
  });

  describe('createSession', () => {
    it('should call service.createSession and return result', async () => {
      const dto: CreateSessionDto = {
        userId: 'user1',
        sessionToken: 'token123',
        expires: new Date(),
      };
      const created = { id: '1', ...dto };
      service.createSession.mockResolvedValue(created);

      await expect(controller.createSession(dto)).resolves.toEqual(created);
      expect(service.createSession).toHaveBeenCalledWith(dto);
    });
  });

  describe('getSessionAndUser', () => {
    it('should call service.getSessionAndUser and return data', async () => {
      const returnValue = {
        session: {
          sessionToken: 'token123',
          userId: 'user1',
          expires: new Date(),
        },
        user: { id: 'user1', email: 'x' },
      };
      service.getSessionAndUser.mockResolvedValue(returnValue);

      await expect(controller.getSessionAndUser('token123')).resolves.toEqual(
        returnValue,
      );
      expect(service.getSessionAndUser).toHaveBeenCalledWith('token123');
    });

    it('should propagate NotFoundException', async () => {
      service.getSessionAndUser.mockRejectedValue(new NotFoundException());
      await expect(controller.getSessionAndUser('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should call service.update and return updated session', async () => {
      const dto: UpdateSessionDto = { expires: new Date() };
      const updated = {
        sessionToken: 'token123',
        userId: 'user1',
        expires: dto.expires,
      };
      service.update.mockResolvedValue(updated);

      await expect(controller.update('token123', dto)).resolves.toEqual(
        updated,
      );
      expect(service.update).toHaveBeenCalledWith('token123', dto);
    });

    it('should propagate errors from service.update', async () => {
      service.update.mockRejectedValue(new Error('Failed'));
      await expect(
        controller.update('token123', {} as UpdateSessionDto),
      ).rejects.toThrow('Failed');
    });
  });

  describe('remove', () => {
    it('should call service.remove and return message', async () => {
      const msg = { message: 'Session deleted successfully' };
      service.remove.mockResolvedValue(msg);

      await expect(controller.remove('token123')).resolves.toEqual(msg);
      expect(service.remove).toHaveBeenCalledWith('token123');
    });

    it('should propagate errors from service.remove', async () => {
      service.remove.mockRejectedValue(new Error('Not found'));
      await expect(controller.remove('token123')).rejects.toThrow('Not found');
    });
  });
});
