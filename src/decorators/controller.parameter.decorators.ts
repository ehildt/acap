import { Body, Param, ParseArrayPipe, Query } from '@nestjs/common';

import { RealmUpsertReq } from '../dtos/realm-upsert-req.dto';
import { RealmsUpsertReq } from '../dtos/realms-upsert.dto.req';

const ParseQueryStrings = new ParseArrayPipe({ items: String, optional: true });
const ParseRealmPipe = new ParseArrayPipe({ items: RealmUpsertReq });
const ParseRealmUpsertByRealmPipe = new ParseArrayPipe({ items: RealmsUpsertReq });

export const QueryRealm = () => Query('realm');
export const ParamRealm = () => Param('realm');
export const QueryIds = () => Query('ids', ParseQueryStrings);
export const QueryId = () => Query('id');
export const QueryRealms = () => Query('realms', ParseQueryStrings);
export const RealmUpsertBody = () => Body(ParseRealmPipe);
export const RealmUpsertRealmBody = () => Body(ParseRealmUpsertByRealmPipe);
