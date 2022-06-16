import { Body, Param, ParseArrayPipe, Query } from '@nestjs/common';
import { CacheManagerUpsertReq } from '../dtos/cache-manager-upsert-req.dto';

const ParseParamConfigIdsPipe = new ParseArrayPipe({ items: String });
const ParseConfigManagerPipe = new ParseArrayPipe({
  items: CacheManagerUpsertReq,
});

export const ParamServiceId = () => Param('serviceId');
export const QueryTTLServiceId = () => Query('ttlServiceId');
export const CacheManagerUpsertBody = () => Body(ParseConfigManagerPipe);
export const ParamConfigIds = () => Param('configIds', ParseParamConfigIdsPipe);
