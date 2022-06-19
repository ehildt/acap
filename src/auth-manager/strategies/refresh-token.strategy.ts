import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

// TODO RefreshTokenStrategy
// ? do we need injectable here
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'REFRESH_TOKEN',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:
        process.env.AUTH_MANAGER_REFRESH_TOKEN_SECRET ?? 'REFRESH_TOKEN_SECRET',
      passReqToCallback: true,
    });
  }

  validate(req: Request, decodedRefreshToken: Record<string, unknown>) {
    return {
      ...decodedRefreshToken,
      refreshToken: req.get('authorization').slice(7),
    };
  }
}
