import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayloadWithAt } from '../types/jwtPayloadWithAt.type';

/**
 * Custom decorator to retrieve the user from the request object.
 * @param data - Optional data key from the JwtPayloadWithRt interface.
 * @param ctx - ExecutionContext object.
 * @returns The value of the specified data key from the user object.
 */
export const GetUserAccessToken = createParamDecorator(
  (data: keyof JwtPayloadWithAt | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as JwtPayloadWithAt;
    return user.accessToken;
  },
);
