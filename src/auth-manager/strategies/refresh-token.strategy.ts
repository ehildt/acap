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
      secretOrKey: 'REFRESH_TOKEN_SECRET',
      passReqToCallback: true,
    });
  }

  // here the payload is the decoded token
  // since passport does not return the token after decoding
  // we need to get it from the request,
  // which is why we pass it to the validate "callback".
  validate(req: Request, payload: any) {
    return {
      ...payload,
      refreshToken: req.get('authorization').slice(7),
    };
  }
}
