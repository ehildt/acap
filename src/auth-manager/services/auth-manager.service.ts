import { hash, verify } from 'argon2';
import { Cache } from 'cache-manager';
import {
  CACHE_MANAGER,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ConfigManagerApi } from '../api/config-manager.api';
import {
  AuthManagerConfig,
  authManagerConfigFactory,
} from '../configs/auth-manager/auth-manager-config-factory.dbs';
import { AuthManagerSigninReq } from '../dtos/auth-manager-signin-req.dto';
import { AuthManagerSignupReq } from '../dtos/auth-manager-signup-req.dto';
import { AuthManagerToken } from '../dtos/auth-manager-token.dto';
import { AuthManagerUserRepository } from './auth-manager-user.repository';

@Injectable()
export class AuthManagerService {
  #config: AuthManagerConfig;

  constructor(
    private readonly userRepo: AuthManagerUserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly configManagerApi: ConfigManagerApi,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  private get config() {
    if (this.#config) return this.#config;
    return (this.#config = authManagerConfigFactory(this.configService));
  }

  signup(req: AuthManagerSignupReq) {
    return this.userRepo.signup(req);
  }

  async signin(
    req: AuthManagerSigninReq,
    refServiceId?: string,
    result: Record<string, unknown> = {},
  ) {
    const user = await this.userRepo.signin(req);

    if (!user || !(await verify(user.hash, req.password)))
      throw new ForbiddenException('username/password does not match');

    const data = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      claims: user.claims?.length ? user.claims : undefined,
      configs: refServiceId && result,
    };

    const ACCESS_TOKEN = this.jwtService.sign(data, {
      expiresIn: this.config.accessTokenTTL,
      secret: this.config.accessTokenSecret,
    });

    const REFRESH_TOKEN = this.jwtService.sign(data, {
      expiresIn: this.config.refreshTokenTTL,
      secret: this.config.refreshTokenSecret,
    });

    await this.cacheManager.set(
      user.email,
      { AUTH_HASH: await hash(REFRESH_TOKEN) },
      { ttl: this.config.refreshTokenTTL },
    );

    return { ACCESS_TOKEN, REFRESH_TOKEN };
  }

  token(req: any, options: any) {
    if (!options?.expiresIn) delete options.expiresIn;
    return this.jwtService.sign(req, options);
  }

  logout(token: AuthManagerToken) {
    return this.cacheManager.del(token.username);
  }

  async refresh(req: AuthManagerToken) {
    return req;
  }

  async challengeOptionalConfigs(serviceId?: string, configIds?: string[]) {
    if (serviceId && configIds?.length)
      return this.configManagerApi.getConfigIds(serviceId, configIds);
    if (serviceId) return this.configManagerApi.getServiceId(serviceId);
  }
}
