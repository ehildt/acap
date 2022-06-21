import { verify } from 'argon2';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthManagerSignupReq } from '../dtos/auth-manager-signup-req.dto';
import { AuthManagerUserRepository } from './auth-manager-user.repository';

@Injectable()
export class AuthManagerService {
  constructor(
    private readonly userRepo: AuthManagerUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signup(req: AuthManagerSignupReq) {
    await this.userRepo.signup(req);
    return {
      [req.username]: {
        ACCESS_TOKEN: this.jwtService.sign(
          { username: req.username },
          {
            expiresIn: 60 * 15,
            secret: process.env.AUTH_MANAGER_ACCESS_TOKEN_SECRET,
          },
        ),
        REFRESH_TOKEN: this.jwtService.sign(
          { username: req.username },
          {
            expiresIn: 60 * 60 * 24 * 7,
            secret: process.env.AUTH_MANAGER_REFRESH_TOKEN_SECRET,
          },
        ),
      },
    };
  }

  async token(req: any, options: any) {
    if (!options?.expiresIn) delete options.expiresIn;
    return this.jwtService.signAsync(req, options);
  }

  async getUsers() {
    return this.userRepo.getUsers();
  }

  async signin(req: AuthManagerSignupReq) {
    const user = await this.userRepo.signin(req);

    if (!user || !(await verify(user.hash, req.password)))
      throw new ForbiddenException('username/password does not match');

    // TODO signin
    // get roles and claims from user
    // return the newly signed tokens (ac,rf)
    // mark as as signed up (rf hash) in the cache
    return 'here are your tokens';
  }

  async logout(req: any) {
    return req;
  }

  async refresh(req: any) {
    return req;
  }
}
