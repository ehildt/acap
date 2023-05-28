import { Delete, Get, Post } from '@nestjs/common';

const namespace = ':namespace';
const namespaceConfigIds = `${namespace}/configs`;
const files = 'files/config.json';

export const GetPagination = () => Get('pagination');
export const PostFile = () => Post(files);
export const DownloadFile = () => Get(files);
export const PostPassThroughPubSub = () => Post();
export const PostNamespace = () => Post(namespace);
export const GetNamespace = () => Get(namespace);
export const GetConfigIds = () => Get(namespaceConfigIds);
export const DeleteNamespace = () => Delete(namespace);
export const DeleteConfigIds = () => Delete(namespaceConfigIds);
