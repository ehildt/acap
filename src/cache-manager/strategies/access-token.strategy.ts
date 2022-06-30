import { verify } from 'argon2';
import { Cache } from 'cache-manager';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Role } from '../constants/role.enum';
import { AuthManagerToken } from '../dtos/auth-manager-token.dto';

export const ACCESS_TOKEN = 'ACCESS_TOKEN';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  ACCESS_TOKEN,
) {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.AUTH_MANAGER_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: any, decodedAccessToken: AuthManagerToken) {
    if (Role.consumer === decodedAccessToken.role) return decodedAccessToken;

    const cache: any = await this.cacheManager.get(decodedAccessToken.id);
    const token = req.get('authorization').slice(7);

    if (!cache?.AUTH_HASH || !(await verify(cache?.AUTH_HASH, token)))
      throw new UnauthorizedException('Session Expired');

    return decodedAccessToken;
  }
}
