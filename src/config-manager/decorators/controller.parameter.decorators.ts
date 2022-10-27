import { Body, Param, ParseArrayPipe } from '@nestjs/common';
import { ConfigManagerUpsertNamespaceReq } from '../dtos/config-manager-upsert-by-namespace.dto.req';
import { ConfigManagerUpsertReq } from '../dtos/config-manager-upsert-req.dto';

const ParseParamConfigIdsPipe = new ParseArrayPipe({ items: String });
const ParseConfigManagerPipe = new ParseArrayPipe({ items: ConfigManagerUpsertReq });
const ParseConfigManagerUpsertByNamespacePipe = new ParseArrayPipe({ items: ConfigManagerUpsertNamespaceReq });

export const ParamNamespace = () => Param('namespace');
export const ParamConfigIds = () => Param('configIds', ParseParamConfigIdsPipe);
export const ConfigManagerUpsertBody = () => Body(ParseConfigManagerPipe);
export const ConfigManagerUpsertNamespaceBody = () => Body(ParseConfigManagerUpsertByNamespacePipe);
