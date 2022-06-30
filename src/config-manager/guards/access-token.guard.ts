import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ACCESS_TOKEN } from '../strategies/access-token.strategy';

@Injectable()
export class AccessTokenAuthGuard extends AuthGuard(ACCESS_TOKEN) {}
