import { METAE_SOURCE, RequestInitOptions } from './acap-api.model';
import { getRealms } from './get-configs.query';
import { getMeta } from './get-meta.query';

export const useACAPApi = (options: RequestInitOptions) => ({
  getMeta: (source: METAE_SOURCE, take: number, skip: number, init?: RequestInitOptions) =>
    getMeta(source, take, skip, init ?? options),
  getRealms: (take: number, skip: number, realms?: Array<string>, init?: RequestInitOptions) =>
    getRealms(take, skip, realms, init ?? options),
});
