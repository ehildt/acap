import { Body, Param, ParseArrayPipe } from '@nestjs/common';
import { ConfigManagerUpsertReq } from '../dtos/config-manager-upsert-req.dto';

export const serviceId = ':serviceId';
export const serviceIdConfigId = `${serviceId}/configs/:configId`;
export const serviceIdConfigIds = `${serviceId}/configs/:configIds`;
export const ServiceIdParam = () => Param('serviceId');
export const ConfigIdParam = () => Param('configId');

export const ConfigManagerUpsertBody = () =>
  Body(new ParseArrayPipe({ items: ConfigManagerUpsertReq }));

export const ConfigIdsParam = () =>
  Param('configIds', new ParseArrayPipe({ items: String }));
