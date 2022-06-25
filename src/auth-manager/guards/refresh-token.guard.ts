import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { REFRESH_TOKEN } from '../strategies/refresh-token.strategy';

@Injectable()
export class RefreshTokenAuthGuard extends AuthGuard(REFRESH_TOKEN) {}
