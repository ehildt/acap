import { hash, verify } from 'argon2';
import { Cache } from 'cache-manager';
import {
  CACHE_MANAGER,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ConfigManagerApi } from '../api/config-manager.api';
import {
  AuthManagerConfig,
  authManagerConfigFactory,
} from '../configs/auth-manager/auth-manager-config-factory.dbs';
import { Role } from '../constants/role.enum';
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
    // TODO authManagerConfigFactory
    // ! turn into a service
    // for it implements the singleton pattern
    return (this.#config = authManagerConfigFactory(this.configService));
  }

  signup(req: AuthManagerSignupReq) {
    return this.userRepo.findOneAndUpdate(req);
  }

  async signin(
    req: AuthManagerSigninReq,
    refServiceId?: string,
    refConfigIds?: string[],
  ) {
    const result = await this.challengeOptionalConfigs(
      refServiceId,
      refConfigIds,
    );

    const user = await this.userRepo.findOne(req);

    if (!user || !(await verify(user.hash, req.password)))
      throw new ForbiddenException('username/password does not match');

    return this.signAccessRefreshToken({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      configs: refServiceId && result,
    });
  }

  async token(
    serviceId: string,
    refServiceId?: string,
    refConfigIds?: string[],
    data?: Record<string, any>,
  ) {
    const configs = await this.challengeOptionalConfigs(
      refServiceId,
      refConfigIds,
    );

    const CONSUMER_TOKEN = this.jwtService.sign(
      {
        serviceId,
        role: Role.consumer,
        ...(Object.keys(data)?.length && { data }),
        configs,
      },
      { secret: this.config.tokenSecret },
    );

    return { CONSUMER_TOKEN };
  }

  async refresh(rawToken: string, token: AuthManagerToken) {
    const cache: any = await this.cacheManager.get(token.id);
    if (cache?.AUTH_HASH && (await verify(cache?.AUTH_HASH, rawToken)))
      return this.signAccessRefreshToken(token);
    throw new UnauthorizedException();
  }

  logout(token: AuthManagerToken) {
    return this.cacheManager.del(token.id);
  }

  challengeOptionalConfigs(refServiceId?: string, refConfigIds?: string[]) {
    if (refServiceId && refConfigIds?.length)
      return this.configManagerApi.getConfigIds(refServiceId, refConfigIds);
    if (refServiceId) return this.configManagerApi.getServiceId(refServiceId);
  }

  async signAccessRefreshToken(token: Omit<AuthManagerToken, 'iat' | 'exp'>) {
    const ACCESS_TOKEN = this.jwtService.sign(token, {
      expiresIn: this.config.accessTokenTTL,
      secret: this.config.tokenSecret,
    });

    const REFRESH_TOKEN = this.jwtService.sign(token, {
      expiresIn: this.config.refreshTokenTTL,
      secret: this.config.tokenSecret,
    });

    await this.cacheManager.set(
      token.id,
      { AUTH_HASH: await hash(ACCESS_TOKEN) },
      { ttl: this.config.accessTokenTTL },
    );

    return { ACCESS_TOKEN, REFRESH_TOKEN };
  }
}
