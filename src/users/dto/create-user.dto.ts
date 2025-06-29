export class CreateUserDto {
  id: string;
  email: string;
  name?: string;
  emailVerified?: string | null;
  image?: string;
}
