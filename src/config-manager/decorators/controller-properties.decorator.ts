import { Body, Param, ParseArrayPipe } from '@nestjs/common';
import { ConfigManagerUpsertReq } from '../dtos/config-manager-upsert-req.dto';

export const namespace = ':namespace';

export const namespaceConfigIds = `${namespace}/configs/:configIds`;
export const ServiceIdParam = () => Param('namespace');

export const ConfigManagerUpsertBody = () =>
  Body(new ParseArrayPipe({ items: ConfigManagerUpsertReq }));

export const ConfigIdsParam = () =>
  Param('configIds', new ParseArrayPipe({ items: String }));
