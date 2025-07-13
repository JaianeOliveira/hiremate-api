import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProviderAccountDataDTO } from 'src/shared/dto/provider-account-data.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly logger: Logger = new Logger(UsersService.name, {
    timestamp: true,
  });
  constructor(private readonly prisma: PrismaService) {}

  async findOrCreateUser(data: ProviderAccountDataDTO) {
    try {
      const result = await this.prisma.user.upsert({
        where: { email: data.email },
        create: {
          email: data.email,
          name: data.name,
          avatar: data.avatar,
          accounts: {
            connectOrCreate: {
              where: {
                provider_provider_account_id: {
                  provider: data.provider,
                  provider_account_id: data.provider_account_id,
                },
              },
              create: {
                provider: data.provider,
                provider_account_id: data.provider_account_id,
              },
            },
          },
        },
        update: {
          name: data.name,
          avatar: data.avatar,
          accounts: {
            connectOrCreate: {
              where: {
                provider_provider_account_id: {
                  provider: data.provider,
                  provider_account_id: data.provider_account_id,
                },
              },
              create: {
                provider: data.provider,
                provider_account_id: data.provider_account_id,
              },
            },
          },
        },
        select: { id: true },
      });

      return result;
    } catch (error) {
      this.logger.error(
        'Cannot create or update user',
        UsersService.prototype.findOrCreateUser,
        { error },
      );

      throw new InternalServerErrorException(
        'Não foi possível criar ou atualizar o usuário',
      );
    }
  }

  async create(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        name: createUserDto.name,
        avatar: createUserDto.image,
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
        provider_provider_account_id: {
          provider,
          provider_account_id: providerAccountId,
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
        avatar: updateUserDto.image,
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
