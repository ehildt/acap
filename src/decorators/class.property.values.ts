import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as yaml from 'js-yaml';

export const JsonYamlContent = createParamDecorator(async (_data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const file = await req.file();
  const data = (await file.toBuffer()).toString();
  try {
    return JSON.parse(data);
  } catch {
    return yaml.load(data, { json: true });
  }
});
