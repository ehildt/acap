import { Delete, Get, Post } from '@nestjs/common';

const source = ':source';
const realm = ':realm';
const realm_id = ':realm/collections/:id';

export const GetMeta = () => Get(source);
export const PostPubSubPubSub = () => Post();
export const PostRealm = () => Post(realm);
export const GetRealm = () => Get(realm);
export const GetSchema = () => Get(realm_id);
export const GetRealmContent = () => Get(realm_id);
export const DeleteRealm = () => Delete(realm);
