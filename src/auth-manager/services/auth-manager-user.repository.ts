import { hash } from 'argon2';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AuthManagerSigninReq } from '../dtos/auth-manager-signin-req.dto';
import { AuthManagerSignupReq } from '../dtos/auth-manager-signup-req.dto';
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

  async findOneAndUpdate(req: AuthManagerSignupReq) {
    return this.user
      .findOneAndUpdate(
        { username: req.username },
        { $set: { hash: await hash(req.password) } },
        { upsert: true },
      )
      .exec();
  }

  findOne(req: AuthManagerSigninReq) {
    return this.user
      .findOne()
      .or([{ email: req.usernameOrEmail }, { username: req.usernameOrEmail }])
      .exec();
  }
}
