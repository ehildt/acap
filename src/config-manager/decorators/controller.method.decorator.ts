import { Delete, Get, Post } from '@nestjs/common';

const serviceId = ':serviceId';
const serviceIdConfigIds = `${serviceId}/configs/:configIds`;

export const PostServiceId = () => Post(serviceId);
export const GetServiceId = () => Get(serviceId);
export const GetConfigIds = () => Get(serviceIdConfigIds);
export const DeleteServiceId = () => Delete(serviceId);
export const DeleteConfigIds = () => Delete(serviceIdConfigIds);
