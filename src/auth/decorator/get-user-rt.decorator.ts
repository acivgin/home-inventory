import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayloadWithRt } from '../types';

/**
 * Custom decorator to retrieve the refresh token of the authenticated user.
 * @param data - Optional data to be passed to the decorator.
 * @param ctx - The execution context of the decorator.
 * @returns The refresh token of the authenticated user.
 */
export const GetUserRefreshToken = createParamDecorator(
  (data: keyof JwtPayloadWithRt | undefined, ctx: ExecutionContext): string => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    const user = request.user as JwtPayloadWithRt;
    return user.refreshToken;
  },
);
