import { hash, verify } from 'argon2';
import { Cache } from 'cache-manager';
import {
  CACHE_MANAGER,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthManagerSigninReq } from '../dtos/auth-manager-signin-req.dto';
import { AuthManagerSignupReq } from '../dtos/auth-manager-signup-req.dto';
import { AuthManagerUserRepository } from './auth-manager-user.repository';

@Injectable()
export class AuthManagerService {
  constructor(
    private readonly userRepo: AuthManagerUserRepository,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  signup(req: AuthManagerSignupReq) {
    return this.userRepo.signup(req);
  }

  async signin(req: AuthManagerSigninReq) {
    const user = await this.userRepo.signin(req);

    if (!user || !(await verify(user.hash, req.password)))
      throw new ForbiddenException('username/password does not match');

    const ACCESS_TOKEN = this.jwtService.sign(
      { username: req.username, role: user.role, claims: user.claims },
      {
        expiresIn: parseInt(process.env.AUTH_MANAGER_ACCESS_TOKEN_TTL, 10),
        secret: process.env.AUTH_MANAGER_ACCESS_TOKEN_SECRET,
      },
    );

    const REFRESH_TOKEN = this.jwtService.sign(
      { username: req.username, role: user.role, claims: user.claims },
      {
        expiresIn: parseInt(process.env.AUTH_MANAGER_REFRESH_TOKEN_TTL, 10),
        secret: process.env.AUTH_MANAGER_REFRESH_TOKEN_SECRET,
      },
    );

    await this.cacheManager.set(
      user.username,
      { REFRESH_TOKEN_HASH: await hash(REFRESH_TOKEN) },
      {
        ttl: parseInt(process.env.AUTH_MANAGER_REFRESH_TOKEN_TTL, 10),
      },
    );

    return { ACCESS_TOKEN, REFRESH_TOKEN };
  }

  token(req: any, options: any) {
    if (!options?.expiresIn) delete options.expiresIn;
    return this.jwtService.sign(req, options);
  }

  logout(req: string) {
    return this.cacheManager.del(req);
  }

  async refresh(req: any) {
    return req;
  }
}
