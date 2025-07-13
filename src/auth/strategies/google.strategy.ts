import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ProviderAccountDataDTO } from 'src/shared/dto/provider-account-data.dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private cfg: ConfigService) {
    super({
      clientID: cfg.get('GOOGLE_CLIENT_ID'),
      clientSecret: cfg.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: `${cfg.get('SELF_URL')}/auth/google/callback`,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const { id, displayName, emails, provider, photos } = profile;
    const user: ProviderAccountDataDTO = {
      provider: provider,
      provider_account_id: id,
      name: displayName,
      email: emails[0].value,
      avatar: photos[0].value,
    };

    done(null, user);
  }
}
