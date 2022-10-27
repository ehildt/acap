import { ConfigManagerUpsertReq } from '../dtos/config-manager-upsert-req.dto';

export const oneOf = {
  isArray: true,
  type: () => ConfigManagerUpsertReq,
  oneOf: [
    { type: 'string', description: 'string or text' },
    { type: 'string', description: 'environment variable identifier' },
    { type: 'Object', description: 'plain old javascript object' },
    { type: 'Array', description: 'a list of dreams & cookies' },
  ],
};
