import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthManagerToken } from '../dtos/auth-manager-token.dto';

export const ACCESS_TOKEN = 'ACCESS_TOKEN';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  ACCESS_TOKEN,
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.AUTH_MANAGER_ACCESS_TOKEN_SECRET,
    });
  }

  validate(decodedAccessToken: AuthManagerToken) {
    if (!decodedAccessToken.configs) delete decodedAccessToken.configs;
    return decodedAccessToken;
  }
}
