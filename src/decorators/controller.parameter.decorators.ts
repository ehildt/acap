import { Body, Param, ParseArrayPipe, Query } from '@nestjs/common';

import { ContentUpsertReq } from '@/dtos/content-upsert-req.dto';
import { RealmsUpsertReq } from '@/dtos/realms-upsert.dto.req';

const ParseQueryStrings = new ParseArrayPipe({ items: String, optional: true });
const ParseRealmPipe = new ParseArrayPipe({ items: ContentUpsertReq });
const ParseRealmUpsertByRealmPipe = new ParseArrayPipe({ items: RealmsUpsertReq });

export const QueryRealm = () => Query('realm');
export const ParamRealm = () => Param('realm');
export const ParamSource = () => Param('source');
export const QueryIds = () => Query('ids', ParseQueryStrings);
export const ParamId = () => Param('id');
export const QueryRealms = () => Query('realms', ParseQueryStrings);
export const QueryFormat = () => Query('format');
export const RealmUpsertBody = () => Body(ParseRealmPipe);
export const RealmUpsertRealmBody = () => Body(ParseRealmUpsertByRealmPipe);
