import { Controller, Delete, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  ConfigIdsParam,
  ConfigManagerUpsertBody,
  serviceId,
  serviceIdConfigIds,
  ServiceIdParam,
} from './decorators/controller-properties.decorator';
import {
  OpenApi_DeleteByServiceId,
  OpenApi_DeleteByServiceIdConfigIds,
  OpenApi_GetByServiceId,
  OpenApi_GetByServiceIdConfigIds,
  OpenApi_Upsert,
} from './decorators/open-api.decorator';
import { ConfigManagerUpsertReq } from './dtos/config-manager-upsert-req.dto';
import { ConfigManagerService } from './services/config-manager.service';

@ApiTags('Config-Manager')
@Controller('configs/services')
export class ConfigManagerController {
  constructor(private readonly managerConfig: ConfigManagerService) {}

  @Post(serviceId)
  @OpenApi_Upsert()
  upsert(
    @ServiceIdParam() serviceId: string,
    @ConfigManagerUpsertBody() req: ConfigManagerUpsertReq[],
  ) {
    return this.managerConfig.upsert(serviceId, req);
  }

  @Get(serviceId)
  @OpenApi_GetByServiceId()
  getByServiceId(@ServiceIdParam() serviceId: string) {
    return this.managerConfig.getByServiceId(serviceId);
  }

  @Get(serviceIdConfigIds)
  @OpenApi_GetByServiceIdConfigIds()
  getByServiceIdConfigIds(
    @ServiceIdParam() serviceId: string,
    @ConfigIdsParam() configIds: string[],
  ) {
    return this.managerConfig.getByServiceIdConfigIds(serviceId, configIds);
  }

  @Delete(serviceId)
  @OpenApi_DeleteByServiceId()
  deleteByServiceId(@ServiceIdParam() serviceId: string) {
    return this.managerConfig.deleteByServiceId(serviceId);
  }

  @Delete(serviceIdConfigIds)
  @OpenApi_DeleteByServiceIdConfigIds()
  deleteByConfigIds(
    @ServiceIdParam() serviceId: string,
    @ConfigIdsParam() configIds: string[],
  ) {
    return this.managerConfig.deleteByConfigId(serviceId, configIds);
  }
}
