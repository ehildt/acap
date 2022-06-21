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

  async signup({ password, ...req }: AuthManagerSignupReq) {
    return this.user.create({ ...req, hash: await hash(password) });
  }

  signin(req: AuthManagerSignupReq) {
    return this.user.findOne({ username: req.username });
  }

  getUsers() {
    return this.user.find();
  }
}
