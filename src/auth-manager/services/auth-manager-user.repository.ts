import { argon2i, hash, verify } from 'argon2';
import { Model } from 'mongoose';
import {
  ForbiddenException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
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
    return this.user.create({
      hash: await hash(req.password, {
        type: argon2i,
      }),
      username: req.username,
      email: req.email,
      role: Role.member,
    });
  }

  async update(req: AuthManagerUpdateReq, token: AuthManagerToken) {
    return this.user
      .findByIdAndUpdate(token.id, {
        email: req.email,
        hash: await hash(req.password, {
          type: argon2i,
        }),
      })
      .exec();
  }

  async elevate(req: AuthManagerElevateReq, role: Role) {
    return this.user
      .findOneAndUpdate({ username: req.username, email: req.email }, { role })
      .exec();
  }

  findOne(req: AuthManagerSigninReq) {
    return this.user.findOne({ email: req.email }).exec();
  }

  async delete(username: string, email: string, password: string) {
    const entity = await this.user.findOne({
      username,
      email,
    });

    if (!entity || !(await verify(entity?.hash, password)))
      throw new UnprocessableEntityException(
        `user<${username}, ${email}, ${password}>`,
      );

    if (entity?.role === Role.superadmin || entity?.role === Role.moderator)
      throw new ForbiddenException(`role<${entity.role}>`);

    await this.user.deleteOne({ username, email });

    return entity;
  }
}
