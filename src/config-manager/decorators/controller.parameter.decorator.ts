import { Body, Param, ParseArrayPipe, Query } from '@nestjs/common';
import { ConfigManagerUpsertReq } from '../dtos/config-manager-upsert-req.dto';

const ParseParamConfigIdsPipe = new ParseArrayPipe({ items: String });
const ParseConfigManagerPipe = new ParseArrayPipe({
  items: ConfigManagerUpsertReq,
});

export const ParamServiceId = () => Param('serviceId');
export const QueryTTLServiceId = () => Query('ttlServiceId');
export const ConfigManagerUpsertBody = () => Body(ParseConfigManagerPipe);
export const ParamConfigIds = () => Param('configIds', ParseParamConfigIdsPipe);
