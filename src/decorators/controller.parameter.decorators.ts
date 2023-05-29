import { Body, Param, ParseArrayPipe, Query } from '@nestjs/common';

import { ConfigManagerUpsertRealmReq } from '../dtos/config-manager-upsert-by-realm.dto.req';
import { ConfigManagerUpsertReq } from '../dtos/config-manager-upsert-req.dto';

const ParseQueryStrings = new ParseArrayPipe({ items: String, optional: true });
const ParseConfigManagerPipe = new ParseArrayPipe({ items: ConfigManagerUpsertReq });
const ParseConfigManagerUpsertByRealmPipe = new ParseArrayPipe({ items: ConfigManagerUpsertRealmReq });

export const ParamRealm = () => Param('realm');
export const QueryConfigIds = () => Query('configIds', ParseQueryStrings);
export const QueryRealms = () => Query('realms', ParseQueryStrings);
export const ConfigManagerUpsertBody = () => Body(ParseConfigManagerPipe);
export const ConfigManagerUpsertRealmBody = () => Body(ParseConfigManagerUpsertByRealmPipe);
