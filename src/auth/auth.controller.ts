import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto';
import { Tokens } from './types';
import { JwtRtGuard } from './guards/jwt-rt-guard';
import { GetUserId, GetUserRefreshToken } from './decorator';
import { Public } from './decorator/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  /**
   * Registers a new user.
   * @param dto - The authentication data for the new user.
   * @returns A Promise that resolves to the result of the sign up operation.
   */
  signUp(@Body() dto: AuthDTO) {
    return this.authService.signUp(dto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  /**
   * Sign in a user.
   * @param dto - The authentication DTO.
   * @returns A promise that resolves to the tokens.
   */
  signIn(@Body() dto: AuthDTO): Promise<Tokens> {
    return this.authService.signIn(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  /**
   * Logs out the user.
   * @param userId - The ID of the user.
   * @returns A Promise that resolves to the result of the logout operation.
   */
  logOut(@GetUserId() userId: number): Promise<void> {
    return this.authService.logOut(userId);
  }

  @Public()
  @UseGuards(JwtRtGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  /**
   * Refreshes the access and refresh tokens for a user.
   * @param userId - The ID of the user.
   * @param refreshToken - The refresh token of the user.
   * @returns A Promise that resolves to an object containing the new access and refresh tokens.
   */
  refresh(
    @GetUserId() userId: number,
    @GetUserRefreshToken() refreshToken: string,
  ): Promise<Tokens> {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
