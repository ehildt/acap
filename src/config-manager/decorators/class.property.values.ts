import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const JsonFile = createParamDecorator(async (_data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return await req.file();
});
