import { Delete, Get, Post } from '@nestjs/common';

const namespace = ':namespace';
const namespaceConfigIds = `${namespace}/configs/:configIds`;

export const GetPagination = () => Get('pagination');
export const PostNamespace = () => Post(namespace);
export const GetNamespace = () => Get(namespace);
export const GetConfigIds = () => Get(namespaceConfigIds);
export const DeleteNamespace = () => Delete(namespace);
export const DeleteConfigIds = () => Delete(namespaceConfigIds);
