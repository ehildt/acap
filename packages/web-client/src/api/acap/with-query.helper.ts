import url from 'url';

type QueryOptions = Record<string, any>;

export function withQuery(query: QueryOptions) {
  return url.format({ query, pathname: '/api/v1/contents', host: 'localhost:3001', protocol: 'http' });
}
