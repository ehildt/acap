import { ApiBody, ApiOkResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CacheManagerUpsertReq } from '../dtos/cache-manager-upsert-req.dto';

export const ApiParamServiceId = () =>
  ApiParam({ name: 'serviceId', type: String });

export const ApiParamConfigId = () =>
  ApiParam({ name: 'configIds', type: String });

export const ApiQueryTtlServiceId = () =>
  ApiQuery({ name: 'ttlServiceId', required: false });

export const ApiBodyConfigManagerUpsert = () =>
  ApiBody({
    isArray: true,
    required: true,
    type: CacheManagerUpsertReq,
  });

export const ApiOkResponseConfigManagerUpsert = () =>
  ApiOkResponse({
    isArray: true,
    type: CacheManagerUpsertReq,
  });
