import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const mockService = {
  create: jest.fn(),
  getUser: jest.fn(),
  getUserByAccount: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('UsersController', () => {
  let controller: UsersController;
  let service: typeof mockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService) as any;
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call service.create and return result', async () => {
      const dto: CreateUserDto = {
        id: '1',
        email: 'a@b.com',
        name: 'Alice',
        image: 'img.png',
      };
      const created = { ...dto };
      service.create.mockResolvedValue(created);

      await expect(controller.create(dto)).resolves.toEqual(created);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('getUser', () => {
    it('should call service.getUser with id', async () => {
      const user = { id: '1', email: 'a@b.com' };
      service.getUser.mockResolvedValue(user);

      await expect(controller.getUser('1', undefined)).resolves.toEqual(user);
      expect(service.getUser).toHaveBeenCalledWith({
        id: '1',
        email: undefined,
      });
    });

    it('should call service.getUser with email', async () => {
      const user = { id: '1', email: 'a@b.com' };
      service.getUser.mockResolvedValue(user);

      await expect(controller.getUser(undefined, 'a@b.com')).resolves.toEqual(
        user,
      );
      expect(service.getUser).toHaveBeenCalledWith({
        id: undefined,
        email: 'a@b.com',
      });
    });

    it('should propagate NotFoundException', async () => {
      service.getUser.mockRejectedValue(new NotFoundException());
      await expect(controller.getUser('x', undefined)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getUserByAccount', () => {
    it('should call service.getUserByAccount and return user', async () => {
      const user = { id: '1', email: 'a@b.com' };
      service.getUserByAccount.mockResolvedValue(user);

      await expect(
        controller.getUserByAccount('google', '123'),
      ).resolves.toEqual(user);
      expect(service.getUserByAccount).toHaveBeenCalledWith('google', '123');
    });

    it('should propagate NotFoundException', async () => {
      service.getUserByAccount.mockRejectedValue(new NotFoundException());
      await expect(controller.getUserByAccount('x', 'y')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should call service.update and return updated user', async () => {
      const dto: UpdateUserDto = {
        email: 'new@b.com',
        name: 'Bob',
        image: 'pic.png',
      };
      const updated = { id: '1', ...dto };
      service.update.mockResolvedValue(updated);

      await expect(controller.update('1', dto)).resolves.toEqual(updated);
      expect(service.update).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('remove', () => {
    it('should call service.remove and return message', async () => {
      const message = { message: 'User deleted successfully' };
      service.remove.mockResolvedValue(message);

      await expect(controller.remove('1')).resolves.toEqual(message);
      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });
});
