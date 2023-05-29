import { Body, Param, ParseArrayPipe, Query } from '@nestjs/common';

import { RealmsUpsertReq } from '../dtos/realms-upsert.dto.req';
import { RealmUpsertReq } from '../dtos/realm-upsert-req.dto';

const ParseQueryStrings = new ParseArrayPipe({ items: String, optional: true });
const ParseRealmPipe = new ParseArrayPipe({ items: RealmUpsertReq });
const ParseRealmUpsertByRealmPipe = new ParseArrayPipe({ items: RealmsUpsertReq });

export const ParamRealm = () => Param('realm');
export const QueryConfigIds = () => Query('configIds', ParseQueryStrings);
export const QueryRealms = () => Query('realms', ParseQueryStrings);
export const RealmUpsertBody = () => Body(ParseRealmPipe);
export const RealmUpsertRealmBody = () => Body(ParseRealmUpsertByRealmPipe);
