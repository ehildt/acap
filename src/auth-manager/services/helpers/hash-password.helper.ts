import { createHash, scryptSync } from 'crypto';

const KEY_LENGTH = parseInt(process.env.AUTH_MANAGER_KEY_LENGTH, 10);
const SALT =
  'a247c0848a893b63ec86a19da1636bf19c42e8eac12149113bbda85a1e2298a1'.normalize();

export function hashPassword(password: string) {
  return createHash(process.env.AUTH_MANAGER_HASH_ALGORITHM ?? 'sha512')
    .update(
      scryptSync(
        password,
        process.env.AUTH_MANAGER_SALT?.normalize() ?? SALT,
        KEY_LENGTH >= 2 ? KEY_LENGTH : 64,
      ).toString('utf8'),
    )
    .digest('hex');
}
