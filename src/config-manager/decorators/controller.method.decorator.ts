import { Delete, Get, Post } from '@nestjs/common';

const namespace = ':namespace';
const serviceIdConfigIds = `${namespace}/configs/:configIds`;

export const GetByPagination = () => Get();
export const PostNamespace = () => Post(namespace);
export const GetNamespace = () => Get(namespace);
export const GetConfigIds = () => Get(serviceIdConfigIds);
export const DeleteNamespace = () => Delete(namespace);
export const DeleteConfigIds = () => Delete(serviceIdConfigIds);
