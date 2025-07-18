import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ProviderAccountDataDTO } from 'src/shared/dto/provider-account-data.dto';
import { UsersService } from 'src/users/users.service';
import { CreteJWTDTO } from './dto/create-jwt.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private userService: UsersService,
  ) {}

  private createJwt(payload: CreteJWTDTO) {
    return this.jwt.sign(payload);
  }

  async generateCredentials(
    user: ProviderAccountDataDTO,
  ): Promise<{ access_token: string }> {
    const { id } = await this.userService.findOrCreateUser(user);

    const token = this.createJwt({
      sub: id,
    });

    return { access_token: token };
  }
}
