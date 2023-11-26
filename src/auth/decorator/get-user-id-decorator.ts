import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from './../../../node_modules/@types/jsonwebtoken/index.d';

/**
 * Custom decorator to extract the user ID from the request object.
 * @param _ The first parameter is ignored.
 * @param ctx The execution context containing the request object.
 * @returns The user ID extracted from the request object.
 */
export const GetLoggedUserId = createParamDecorator(
  (_: undefined, ctx: ExecutionContext): string => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    return user.sub;
  },
);
