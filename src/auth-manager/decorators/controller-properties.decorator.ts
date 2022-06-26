import {
  createParamDecorator,
  ExecutionContext,
  Param,
  ParseArrayPipe,
  Post,
  Query,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { Role, ROLES } from '../constants/role.enum';
import { AccessTokenAuthGuard } from '../guards/access-token.guard';
import { RefreshTokenAuthGuard } from '../guards/refresh-token.guard';
import { RolesGuard } from '../guards/roles.guard';

const parseArrayPipe = new ParseArrayPipe({ items: String, optional: true });

const getRawTokenFromRequest = (_: string, ctx: ExecutionContext) =>
  ctx.switchToHttp().getRequest().user.refreshToken;

const getTokenFromRequest = (_: string, ctx: ExecutionContext) => {
  const token = ctx.switchToHttp().getRequest().user;
  delete token.refreshToken;
  delete token.iat;
  delete token.exp;
  return token;
};

export const ServiceIdParam = () => Param('serviceId');

export const PostLogout = () => Post('logout');
export const PostRefresh = () => Post('refresh');
export const PostSignup = () => Post('signup');
export const PostSignin = () => Post('signin');
export const PostConsumerToken = () => Post('token/:serviceId');

export const QueryRefServiceId = () => Query('refServiceId');
export const QueryRefConfigIds = () => Query('refConfigIds', parseArrayPipe);

export const Token = createParamDecorator(getTokenFromRequest);
export const RawToken = createParamDecorator(getRawTokenFromRequest);

export const RefreshTokenGuard = () =>
  UseGuards(RefreshTokenAuthGuard, RolesGuard);

export const AccessTokenGuard = () =>
  UseGuards(AccessTokenAuthGuard, RolesGuard);

export const Roles = (...roles: Role[]) => SetMetadata(ROLES, roles);
