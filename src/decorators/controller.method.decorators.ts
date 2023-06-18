import { Delete, Get, Post } from '@nestjs/common';

const realm = ':realm';
const realm_id = ':realm/collections/:id';
const configFile = 'realm-config';
const schemaConfigFile = 'schema-config';

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
