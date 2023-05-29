import { ApiBody, ApiOkResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

import { ConfigManagerLeanRes } from '../dtos/config-manager.res.dto';
import { ConfigManagerUpsertRealmReq } from '../dtos/config-manager-upsert-by-realm.dto.req';
import { ConfigManagerUpsertReq } from '../dtos/config-manager-upsert-req.dto';

export const ApiParamRealm = () => ApiParam({ name: 'realm', type: String });
export const ApiQueryConfigIds = () => ApiQuery({ name: 'configIds', type: String, isArray: true });
export const ApiQueryTake = () => ApiQuery({ name: 'take', example: '100' });
export const ApiQuerySkip = () => ApiQuery({ name: 'skip', example: '0' });
export const ApiQueryRealms = (required = false) => ApiQuery({ name: 'realms', type: String, isArray: true, required });

export const ApiBodyConfigManagerUpsert = () =>
  ApiBody({
    isArray: true,
    required: true,
    type: ConfigManagerUpsertReq,
  });

export const ApiBodyConfigManagerUpsertPerRealm = () =>
  ApiBody({
    isArray: true,
    required: true,
    type: ConfigManagerUpsertRealmReq,
  });

export const ApiOkResponseConfigManagerUpsert = () =>
  ApiOkResponse({
    isArray: true,
    type: ConfigManagerUpsertReq,
  });

export const ApiOkResponsePagination = () =>
  ApiOkResponse({
    isArray: true,
    type: ConfigManagerLeanRes,
  });
