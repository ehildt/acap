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
      secretOrKey: 'ACCESS_TOKEN_SECRET',
    });
  }

  // here the payload is the decoded token
  validate(payload: any) {
    return payload;
  }
}
