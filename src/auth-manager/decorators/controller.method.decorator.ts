import { Delete, Post, Put, UseGuards } from '@nestjs/common';
import { AccessTokenAuthGuard } from '../guards/access-token.guard';
import { RefreshTokenAuthGuard } from '../guards/refresh-token.guard';
import { RolesGuard } from '../guards/roles.guard';

export const PostLogout = () => Post('logout');
export const PostRefresh = () => Post('refresh');
export const PutSignup = () => Put('signup');
export const PutUpdate = () => Put('update');
export const PutElevate = () => Put('/users/elevates/:role');
export const PostSignin = () => Post('signin');
export const PutConsumerToken = () => Put('consumers/tokens/:serviceId');
export const DeleteUser = () => Delete('/optout');

export const RefreshTokenGuard = () =>
  UseGuards(RefreshTokenAuthGuard, RolesGuard);

export const AccessTokenGuard = () =>
  UseGuards(AccessTokenAuthGuard, RolesGuard);
