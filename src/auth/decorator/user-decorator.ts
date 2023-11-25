import { createParamDecorator, ExecutionContext } from '@nestjs/common';

//If you want to return specific user data, you can pass a string to the decorator.
//For example, if you want to return the user's id, you can do this: >>> getUser(GetUser() user : User, @GetUserData('id') userId: number) <<<
export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    if (data) {
      return request.user[data];
    }
    return request.user;
  },
);

// export const GetUser = createParamDecorator(
//   (data: unknown, ctx: ExecutionContext) => {
//     const request: Express.Request = ctx.switchToHttp().getRequest();
//     return request.user;
//   },
// );
