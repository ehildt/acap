import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AuthManagerToken } from '../dtos/auth-manager-token.dto';

export const ACCESS_TOKEN = 'ACCESS_TOKEN';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  ACCESS_TOKEN,
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.AUTH_MANAGER_ACCESS_TOKEN_SECRET,
    });
  }

  validate(decodedAccessToken: AuthManagerToken) {
    return decodedAccessToken;
  }
}
