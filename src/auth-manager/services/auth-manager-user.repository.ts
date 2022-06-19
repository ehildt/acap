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
    private readonly authModel: Model<AuthManagerUserDocument>,
  ) {}

  signup(req: AuthManagerSignupReq) {
    return this.authModel.create(req);
  }

  getUsers() {
    return this.authModel.find();
  }
}
