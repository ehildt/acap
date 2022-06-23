import { ParseArrayPipe, Post, Query } from '@nestjs/common';

export const PostLogout = () => Post('logout');
export const PostRefresh = () => Post('refresh');
export const PostSignup = () => Post('signup');
export const PostSignin = () => Post('signin');

export const QueryRefServiceId = () => Query('refServiceId');
export const QueryRefConfigIds = () =>
  Query('refConfigIds', new ParseArrayPipe({ items: String, optional: true }));
