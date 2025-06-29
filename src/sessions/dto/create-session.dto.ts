export class CreateSessionDto {
  userId: string;
  sessionToken: string;
  expires: Date;
}
