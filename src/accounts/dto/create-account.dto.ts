export class CreateAccountDto {
  userId: string;

  provider: string;
  providerAccountId: string;
  type: string;
  providerAccountData?: Record<string, any>;
  accessToken?: string;
  refreshToken?: string;
  scope?: string;
  tokenType?: string;
  idToken?: string;
  sessionState?: string;
  expiresAt?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
