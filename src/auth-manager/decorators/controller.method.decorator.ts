import { Post, UseGuards } from '@nestjs/common';
import { AccessTokenAuthGuard } from '../guards/access-token.guard';
import { RefreshTokenAuthGuard } from '../guards/refresh-token.guard';
import { RolesGuard } from '../guards/roles.guard';

export const PostLogout = () => Post('logout');
export const PostRefresh = () => Post('refresh');
export const PostSignup = () => Post('signup');
export const PostUpdate = () => Post('update');
export const PostElevate = () => Post('/users/elevates/:role');
export const PostSignin = () => Post('signin');
export const PostConsumerToken = () => Post('consumers/tokens/:serviceId');

export const RefreshTokenGuard = () =>
  UseGuards(RefreshTokenAuthGuard, RolesGuard);

export const AccessTokenGuard = () =>
  UseGuards(AccessTokenAuthGuard, RolesGuard);