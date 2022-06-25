import { Body, Param, ParseArrayPipe, UseGuards } from '@nestjs/common';
import { ConfigManagerUpsertReq } from '../dtos/config-manager-upsert-req.dto';
import { AccessTokenAuthGuard } from '../guards/auth-manager-access-token.guard';

export const serviceId = ':serviceId';

export const serviceIdConfigIds = `${serviceId}/configs/:configIds`;
export const ServiceIdParam = () => Param('serviceId');

export const ConfigManagerUpsertBody = () =>
  Body(new ParseArrayPipe({ items: ConfigManagerUpsertReq }));

export const ConfigIdsParam = () =>
  Param('configIds', new ParseArrayPipe({ items: String }));

export const AccessTokenGuard = () => UseGuards(AccessTokenAuthGuard);
