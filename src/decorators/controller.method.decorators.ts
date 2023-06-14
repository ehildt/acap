import { Delete, Get, Post } from '@nestjs/common';

const realm = ':realm';
const realm_id = ':realm/collections/:id';
const realmFiles = 'realm-config.json';
const schemaFiles = 'schema-config.json';

export const PostFile = () => Post(realmFiles);
export const DownloadFile = () => Get(realmFiles);
export const PostSchemaFile = () => Post(schemaFiles);
export const DownloadSchemaFile = () => Get(schemaFiles);
export const PostPubSubPubSub = () => Post();
export const PostRealm = () => Post(realm);
export const GetRealm = () => Get(realm);
export const GetSchema = () => Get(realm_id);
export const GetRealmConfig = () => Get(realm_id);
export const DeleteRealm = () => Delete(realm);
