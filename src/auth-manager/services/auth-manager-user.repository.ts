import { hash } from 'argon2';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
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

  async signup(req: AuthManagerSignupReq) {
    return this.user
      .findOneAndUpdate(
        { username: req.username },
        { $set: { hash: await hash(req.password) } },
        { upsert: true },
      )
      .exec();
  }

  signin(req: AuthManagerSignupReq) {
    return this.user.findOne({ username: req.username }).exec();
  }

  getUsers() {
    return this.user.find().exec();
  }
}
