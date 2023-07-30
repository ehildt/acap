import { createParamDecorator, Delete, ExecutionContext, Get, Post } from '@nestjs/common';
import * as yaml from 'js-yaml';

const source = ':source';
const realm = ':realm';
const realm_id = ':realm/collections/:id';
const configFile = 'realm-config';
const schemaConfigFile = 'schema-config';

export const GetMeta = () => Get(source);
export const PostFile = () => Post(configFile);
export const DownloadFile = () => Get(configFile);
export const PostSchemaFile = () => Post(schemaConfigFile);
export const DownloadSchemaFile = () => Get(schemaConfigFile);
export const PostPubSubPubSub = () => Post();
export const PostRealm = () => Post(realm);
export const GetRealm = () => Get(realm);
export const GetSchema = () => Get(realm_id);
export const GetRealmConfig = () => Get(realm_id);
export const DeleteRealm = () => Delete(realm);

export const JsonYamlContentParser = createParamDecorator(async (_data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const file = await req.file();
  const data = (await file.toBuffer()).toString();
  try {
    return JSON.parse(data);
  } catch {
    return yaml.load(data, { json: true });
  }
});
