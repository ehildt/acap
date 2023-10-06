import { METAE_SOURCE, RequestInitOptions } from './acap-api.model';

export async function getMeta(source: METAE_SOURCE, take: number = 100, skip: number = 0, init?: RequestInitOptions) {
  try {
    return fetch(`${init?.baseUrl}/api/v1/metae/${source}?take=${take}&skip=${skip}&verbose=true`, init);
  } catch (error) {
    console.log(error);
  }
}
