import {
  createParamDecorator,
  ExecutionContext,
  Param,
  Query,
} from '@nestjs/common';

const getRawTokenFromRequest = (_: string, ctx: ExecutionContext) =>
  ctx.switchToHttp().getRequest().user.refreshToken;

const getTokenFromRequest = (_: string, ctx: ExecutionContext) => {
  const token = ctx.switchToHttp().getRequest().user;
  delete token.refreshToken;
  delete token.iat;
  delete token.exp;
  return token;
};

export const ParamServiceId = () => Param('serviceId');
export const ParamRole = () => Param('role');

export const QueryUsername = () => Query('username');
export const QueryPassword = () => Query('password');
export const QueryEmail = () => Query('email');

export const Token = createParamDecorator(getTokenFromRequest);
export const RawToken = createParamDecorator(getRawTokenFromRequest);
