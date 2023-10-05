import { RequestInitOptions } from './acap-api.model';
import { withQuery } from './with-query.helper';

export async function getRealms(
  take: number = 100,
  skip: number = 0,
  realms?: Array<string>,
  init?: RequestInitOptions,
) {
  try {
    const url = withQuery({
      take,
      skip,
      realms: ['UHH'],
    });

    console.log({ url });
    const realmies = realms?.reduce((acc, val) => `${acc},${val}`);
    return fetch(
      `${init?.baseUrl}/api/v1/contents?take=${take}&skip=${skip}${realmies ? '&realms=' + realmies : ''}`,
      init,
    );
  } catch (error) {
    console.log(error);
  }
}
