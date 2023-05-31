import { Delete, Get, Post } from '@nestjs/common';

const realm = ':realm';
const files = 'files/config.json';

export const PostFile = () => Post(files);
export const DownloadFile = () => Get(files);
export const PostPassThroughPubSub = () => Post();
export const PostRealm = () => Post(realm);
export const GetRealm = () => Get(realm);
export const DeleteRealm = () => Delete(realm);
