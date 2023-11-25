/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async signIn() {
    return { message: 'This action signs in a user' };
  }

  async signUp() {
    return { message: 'This action adds a new user' };
  }
}
