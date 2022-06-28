import { argon2i, hash } from 'argon2';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from '../constants/role.enum';
import { AuthManagerElevateReq } from '../dtos/auth-manager-elevate-req.dto';
import { AuthManagerSigninReq } from '../dtos/auth-manager-signin-req.dto';
import { AuthManagerSignupReq } from '../dtos/auth-manager-signup-req.dto';
import { AuthManagerToken } from '../dtos/auth-manager-token.dto';
import { AuthManagerUpdateReq } from '../dtos/auth-manager-update-req.dto';
import {
  AuthManagerUser,
  AuthManagerUserDocument,
} from '../schemas/auth-manager-user.schema';

@Injectable()
export class AuthManagerUserRepository {
  constructor(
    @InjectModel(AuthManagerUser.name)
    private readonly user: Model<AuthManagerUserDocument>,
  ) {}

  async create(req: AuthManagerSignupReq) {
    const passwordHash = await hash(req.password, { type: argon2i });
    return this.user.create({
      hash: passwordHash,
      username: req.username,
      email: req.email,
      role: Role.member,
    });
  }

  async update(req: AuthManagerUpdateReq, token: AuthManagerToken) {
    const passwordHash = await hash(req.password, { type: argon2i });
    return this.user
      .findByIdAndUpdate(token.id, {
        hash: passwordHash,
        username: req.username,
        email: req.email,
      })
      .exec();
  }

  async elevate(req: AuthManagerElevateReq, role: Role) {
    return this.user
      .findOneAndUpdate({ username: req.username, email: req.email }, { role })
      .exec();
  }

  findOne(req: AuthManagerSigninReq) {
    return this.user
      .findOne()
      .or([{ email: req.usernameOrEmail }, { username: req.usernameOrEmail }])
      .exec();
  }
}
