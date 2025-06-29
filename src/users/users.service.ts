import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        name: createUserDto.name,
        image: createUserDto.image,
      },
    });

    return user;
  }

  async getUser({ id, email }: { id?: string; email?: string }) {
    let user;
    if (id) {
      user = await this.prisma.user.findUnique({ where: { id } });
    } else if (email) {
      user = await this.prisma.user.findUnique({ where: { email } });
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getUserByAccount(provider: string, providerAccountId: string) {
    const account = await this.prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId,
        },
      },
      include: {
        user: true,
      },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account.user; // Return the user associated with the account
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const user = this.prisma.user.update({
      where: { id },
      data: {
        name: updateUserDto.name,
        email: updateUserDto.email,
        image: updateUserDto.image,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  remove(id: string) {
    const user = this.prisma.user.delete({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return { message: 'User deleted successfully' };
  }
}
