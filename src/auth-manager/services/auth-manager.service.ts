import { argon2i, hash, verify } from 'argon2';
import { Cache } from 'cache-manager';
import {
  CACHE_MANAGER,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigFactoryService } from '../configs/config-factory.service';
import { Role } from '../constants/role.enum';
import { AuthManagerElevateReq } from '../dtos/auth-manager-elevate-req.dto';
import { AuthManagerSigninReq } from '../dtos/auth-manager-signin-req.dto';
import { AuthManagerSignupReq } from '../dtos/auth-manager-signup-req.dto';
import { AuthManagerToken } from '../dtos/auth-manager-token.dto';
import { AuthManagerUpdateReq } from '../dtos/auth-manager-update-req.dto';
import { AuthManagerUserRepository } from './auth-manager-user.repository';

@Injectable()
export class AuthManagerService {
  constructor(
    private readonly userRepo: AuthManagerUserRepository,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly configFactory: ConfigFactoryService,
  ) {}

  async signup(req: AuthManagerSignupReq) {
    try {
      await this.userRepo.create(req);
    } catch (error) {
      throw new ForbiddenException('email/username already exist');
    }
  }

  async update(req: AuthManagerUpdateReq, token: AuthManagerToken) {
    try {
      await this.userRepo.update(req, token);
    } catch (error) {
      throw new ForbiddenException('Restricted or access denied');
    }
  }

  async elevate(
    req: AuthManagerElevateReq,
    role: Role,
    token: AuthManagerToken,
  ) {
    try {
      if (token.role === Role.superadmin) {
        const entity = await this.userRepo.elevate(req, role);
        if (entity) return this.cacheManager.del(entity.id);
      }
      throw new ForbiddenException('Restricted Access');
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async signin(req: AuthManagerSigninReq) {
    const user = await this.userRepo.findOne(req);

    if (!user || !(await verify(user.hash, req.password)))
      throw new ForbiddenException(`signin<${req.email}, ${req.password}>`);

    return this.signAccessRefreshToken({
      id: user.id,
      role: user.role,
      username: user.username,
      email: user.email,
    });
  }

  async token(serviceId: string, data?: Record<string, any>) {
    const config = this.configFactory.auth;

    return {
      CONSUMER_TOKEN: this.jwtService.sign(
        {
          serviceId,
          role: Role.consumer,
          ...(Object.keys(data)?.length && { data }),
        },
        { secret: config.tokenSecret },
      ),
    };
  }

  async refresh(rawToken: string, token: AuthManagerToken) {
    const cache: any = await this.cacheManager.get(token.id);
    if (
      cache?.AUTH_REFRESH_HASH &&
      (await verify(cache?.AUTH_REFRESH_HASH, rawToken))
    )
      return this.signAccessRefreshToken(token);
    throw new UnauthorizedException();
  }

  logout(token: AuthManagerToken) {
    return this.cacheManager.del(token.id);
  }

  async signAccessRefreshToken(token: Omit<AuthManagerToken, 'iat' | 'exp'>) {
    const config = this.configFactory.auth;
    const ACCESS_TOKEN = this.jwtService.sign(token, {
      expiresIn: config.accessTokenTTL,
      secret: config.tokenSecret,
    });

    const REFRESH_TOKEN = this.jwtService.sign(token, {
      expiresIn: config.refreshTokenTTL,
      secret: config.tokenSecret,
    });

    await this.cacheManager.set(
      token.id,
      {
        AUTH_ACCESS_HASH: await hash(ACCESS_TOKEN, {
          type: argon2i,
        }),
        AUTH_REFRESH_HASH: await hash(REFRESH_TOKEN, {
          type: argon2i,
        }),
      },
      { ttl: config.accessTokenTTL },
    );

    return { ACCESS_TOKEN, REFRESH_TOKEN };
  }

  async delete(username: string, email: string, password: string) {
    const entity = await this.userRepo.delete(username, email, password);
    if (entity) await this.cacheManager.del(entity?.id);
  }
}
