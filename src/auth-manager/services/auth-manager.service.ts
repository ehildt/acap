import { Injectable } from '@nestjs/common';
import { AuthManagerSignupReq } from '../dtos/auth-manager-signup-req.dto';
import { AuthManagerUserRepository } from './auth-manager-user.repository';

@Injectable()
export class AuthManagerService {
  constructor(private readonly userRepo: AuthManagerUserRepository) {}

  async signup(req: AuthManagerSignupReq[]) {
    return this.userRepo.signup(req);
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
