import { Delete, Get, Post, UseGuards } from '@nestjs/common';
import { AccessTokenAuthGuard } from '../guards/access-token.guard';
import { RolesGuard } from '../guards/roles.guard';

const serviceId = ':serviceId';
const serviceIdConfigIds = `${serviceId}/configs/:configIds`;

export const PostServiceId = () => Post(serviceId);
export const GetServiceId = () => Get(serviceId);
export const GetConfigIds = () => Get(serviceIdConfigIds);
export const DeleteServiceId = () => Delete(serviceId);
export const DeleteConfigIds = () => Delete(serviceIdConfigIds);

export const AccessTokenGuard = () =>
  UseGuards(AccessTokenAuthGuard, RolesGuard);
