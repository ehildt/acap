export type METAE_SOURCE = 'schemas' | 'realms';

export type RequestInitOptions = {
  baseUrl: string;
} & Partial<RequestInit>;
