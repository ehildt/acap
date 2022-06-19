import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AuthManagerSignupReq } from '../dtos/auth-manager-signup-req.dto';
import {
  AuthManagerUser,
  AuthManagerUserDocument,
} from '../schemas/auth-manager-user.schema';
import { prepareBulkWriteSignup } from './helpers/prepare-bulk-write-upsert.helper';

@Injectable()
export class AuthManagerUserRepository {
  constructor(
    @InjectModel(AuthManagerUser.name)
    private readonly authModel: Model<AuthManagerUserDocument>,
  ) {}

  signup(req: AuthManagerSignupReq[]) {
    const rowsToSingup = prepareBulkWriteSignup(req);
    return this.authModel.bulkWrite(rowsToSingup);
  }

  getUsers() {
    return this.authModel.find();
  }
}
