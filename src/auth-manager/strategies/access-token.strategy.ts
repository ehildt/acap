import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

// TODO AccessTokenStrategy
// ? do we need injectable here
@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'ACCESS_TOKEN',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:
        process.env.AUTH_MANAGER_ACCESS_TOKEN_SECRET ?? 'ACCESS_TOKEN_SECRET',
    });
  }

  validate(decodedAccessToken: Record<string, unknown>) {
    return decodedAccessToken;
  }
}
