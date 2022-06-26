import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthManagerToken } from '../dtos/auth-manager-token.dto';

export const REFRESH_TOKEN = 'REFRESH_TOKEN';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  REFRESH_TOKEN,
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.AUTH_MANAGER_REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  // here req is of type Request from express
  // we do not import the type for sake of the
  // dependency-cruiser rule not-to-dev-dep
  validate(req: any, decodedRefreshToken: AuthManagerToken) {
    if (!decodedRefreshToken.configs) delete decodedRefreshToken.configs;
    return {
      ...decodedRefreshToken,
      refreshToken: req.get('authorization').slice(7),
    };
  }
}
