import { Exclude, Expose } from 'class-transformer';

export class UserResponseDTO {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  firstName?: string;

  @Expose()
  lastName?: string;

  @Expose()
  role: string;

  @Expose()
  createdAt: Date;

  @Exclude()
  hashAt: string;

  @Exclude()
  hashedRt: string;

  constructor(partial: Partial<UserResponseDTO>) {
    Object.assign(this, partial);
  }
}

export class AuthResponseDTO {
  @Expose()
  access_token: string;

  @Expose()
  refresh_token: string;

  @Expose()
  user: UserResponseDTO;

  constructor(
    tokens: { access_token: string; refresh_token: string },
    user: any,
  ) {
    this.access_token = tokens.access_token;
    this.refresh_token = tokens.refresh_token;
    this.user = new UserResponseDTO(user);
  }
}
