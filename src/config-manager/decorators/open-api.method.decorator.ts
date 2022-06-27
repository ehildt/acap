import { ApiBody, ApiOkResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ConfigManagerUpsertReq } from '../dtos/config-manager-upsert-req.dto';

export const ApiParamServiceId = () =>
  ApiParam({ name: 'serviceId', type: String });

export const ApiParamConfigId = () =>
  ApiParam({ name: 'configIds', type: String });

export const ApiQueryTTLServiceId = () =>
  ApiQuery({
    type: Number,
    required: false,
    name: 'ttlServiceId',
  });

export const ApiBodyConfigManagerUpsert = () =>
  ApiBody({
    isArray: true,
    required: true,
    type: ConfigManagerUpsertReq,
  });

export const ApiOkResponseConfigManagerUpsert = () =>
  ApiOkResponse({
    isArray: true,
    type: ConfigManagerUpsertReq,
  });
