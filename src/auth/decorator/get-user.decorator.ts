import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayloadWithRt } from '../types';

/**
 * Custom decorator to retrieve the user from the request object.
 * @param data - Optional data key from the JwtPayloadWithRt interface.
 * @param ctx - ExecutionContext object.
 * @returns The value of the specified data key from the user object.
 */
export const GetUser = createParamDecorator(
  (data: keyof JwtPayloadWithRt | undefined, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return user[data];
  },
);
