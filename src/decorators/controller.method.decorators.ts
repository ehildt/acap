import { Delete, Get, Post } from '@nestjs/common';

const realm = ':realm';
const realm_id = ':realm/:id';
const files = 'realm-config.json';

export const PostFile = () => Post(files);
export const DownloadFile = () => Get(files);
export const PostPubSubPubSub = () => Post();
export const PostRealm = () => Post(realm);
export const GetRealm = () => Get(realm);
export const GetSchema = () => Get(realm_id);
export const DeleteRealm = () => Delete(realm);
