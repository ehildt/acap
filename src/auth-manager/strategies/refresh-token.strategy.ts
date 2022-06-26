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

export const REFRESH_TOKEN = 'REFRESH_TOKEN';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  REFRESH_TOKEN,
) {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.AUTH_MANAGER_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  // here req is of type Request from express
  // we do not import the type for sake of the
  // dependency-cruiser rule not-to-dev-dep
  async validate(req: any, decodedRefreshToken: AuthManagerToken) {
    if (Role[decodedRefreshToken.role]) return decodedRefreshToken;

    const cache: any = await this.cacheManager.get(decodedRefreshToken.id);
    const token = req.get('authorization').slice(7);

    if (!cache?.AUTH_HASH || !(await verify(cache?.AUTH_HASH, token)))
      throw new UnauthorizedException('session expired');

    return {
      ...decodedRefreshToken,
      refreshToken: req.get('authorization').slice(7),
    };
  }
}
