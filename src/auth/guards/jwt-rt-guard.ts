import { AuthGuard } from '@nestjs/passport';

/**
 * Guard that extends the AuthGuard class for JWT refresh token authentication.
 */
export class JwtRtGuard extends AuthGuard('jwt-refresh') {
  constructor() {
    super();
  }
}
