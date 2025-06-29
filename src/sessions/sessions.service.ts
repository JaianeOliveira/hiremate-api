import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) {}
  async createSession(createSessionDto: CreateSessionDto) {
    return await this.prisma.session.create({
      data: {
        userId: createSessionDto.userId,
        sessionToken: createSessionDto.sessionToken,
        expires: createSessionDto.expires,
      },
    });
  }

  async getSessionAndUser(sessionToken: string) {
    const session = await this.prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    const { user, ...sessionData } = session;

    return {
      session: sessionData,
      user: session.user,
    };
  }

  async update(sessionToken: string, updateSessionDto: UpdateSessionDto) {}

  async remove(sessionToken: string) {
    const session = await this.prisma.session.delete({
      where: { sessionToken },
    });

    if (!session) {
      throw new Error('Session not found');
    }

    return { message: 'Session deleted successfully' };
  }
}
