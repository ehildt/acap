import { Injectable } from '@nestjs/common';
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

  async getUsers() {
    return this.userRepo.getUsers();
  }

  async signin(req: any) {
    return req;
  }

  async logout(req: any) {
    return req;
  }

  async refresh(req: any) {
    return req;
  }
}
