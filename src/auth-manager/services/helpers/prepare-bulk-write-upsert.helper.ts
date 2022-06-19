import { AuthManagerSignupReq } from '@/auth-manager/dtos/auth-manager-signup-req.dto';
import { hashPassword } from './hash-password.helper';

export function prepareBulkWriteSignup(req: AuthManagerSignupReq[]) {
  return req.map((signup) => ({
    updateOne: {
      upsert: true,
      filter: { username: signup.username },
      update: {
        username: signup.username,
        password: hashPassword(signup.password),
      },
    },
  }));
}
