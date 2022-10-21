import { ApiBody, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { ConfigManagerUpsertReq } from '../dtos/config-manager-upsert-req.dto';

export const ApiParamNamespace = () => ApiParam({ name: 'namespace', type: String });

export const ApiParamConfigId = () => ApiParam({ name: 'configIds', type: String });

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
