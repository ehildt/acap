import { argon2i, hash } from 'argon2';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from '../constants/role.enum';
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
    const passwordHash = await hash(req.password, { type: argon2i });
    return this.user
      .findOneAndUpdate(
        { email: req.email, hash: passwordHash },
        {
          $set: {
            hash: passwordHash,
            username: req.username,
            email: req.email,
            role: Role.member,
          },
        },
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
