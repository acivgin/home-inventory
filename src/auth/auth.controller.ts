import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() dto: AuthDTO) {
    return this.authService.signUp(dto);
  }

  @Get('signin')
  signIn(@Body() dto: AuthDTO) {
    return this.authService.signIn(dto);
  }
}
