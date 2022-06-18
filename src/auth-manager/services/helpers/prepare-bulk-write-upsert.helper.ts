import { AuthManagerSignupReq } from '@/auth-manager/dtos/auth-manager-signup-req.dto';

export function prepareBulkWriteSignup(req: AuthManagerSignupReq[]) {
  return req.map((signup) => ({
    updateOne: {
      upsert: true,
      filter: { email: signup.email },
      update: signup,
    },
  }));
}
