import { ExtractJwt, Strategy } from 'passport-jwt';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Role } from '../constants/role.enum';
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
    if (Role.member === decodedAccessToken.role)
      throw new ForbiddenException('Restricted Access');
    return decodedAccessToken;
  }
}
