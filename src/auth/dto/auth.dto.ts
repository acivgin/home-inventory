import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  // @IsStrongPassword()
  password: string;

  // @Exclude()
  firstName?: string;

  // @Exclude()
  lastName?: string;

  role?: Role;
}

export enum Role {
  USER,
  ADMIN,
}
