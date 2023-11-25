import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  // @IsStrongPassword()
  password: string;

  @IsString()
  firstName?: string;

  @IsString()
  lastName?: string;

  role?: Role;
}

export enum Role {
  USER,
  ADMIN,
}
