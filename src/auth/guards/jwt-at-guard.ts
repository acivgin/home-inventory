import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
/**
 * Custom JWT Access Token Guard.
 * Extends the AuthGuard class provided by NestJS to handle JWT authentication for access tokens.
 * This guard checks if a route is public or requires authentication based on the presence of 'isPublic' metadata.
 * If the route is public, access is allowed without authentication.
 * If the route is not public, the default JWT AuthGuard behavior is used.
 */
export class JwtAtGuard extends AuthGuard('jwt') {
  // Inject the Reflector, which is used to retrieve metadata
  constructor(private reflector: Reflector) {
    super();
  }

  // Override the canActivate method, which determines whether a route can be accessed
  canActivate(context: ExecutionContext) {
    // Use the Reflector to check if the 'isPublic' metadata is set on the route handler or controller
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    // If the route is public, bypass the guard and allow access
    if (isPublic) {
      return true;
    }

    // If the route is not public, use the default JWT AuthGuard behavior
    return super.canActivate(context);
  }
}
