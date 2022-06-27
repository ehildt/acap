import { Controller, UnprocessableEntityException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role } from './constants/role.enum';
import { Roles } from './decorators/controller.custom.decorator';
import {
  AccessTokenGuard,
  DeleteConfigIds,
  DeleteServiceId,
  GetConfigIds,
  GetServiceId,
  PostServiceId,
} from './decorators/controller.method.decorator';
import {
  ConfigManagerUpsertBody,
  ParamConfigIds,
  ParamServiceId,
  QueryTTLServiceId,
} from './decorators/controller.parameter.decorator';
import {
  OpenApi_DeleteByServiceId,
  OpenApi_DeleteByServiceIdConfigIds,
  OpenApi_GetByServiceId,
  OpenApi_GetByServiceIdConfigIds,
  OpenApi_Upsert,
} from './decorators/open-api.controller.decorator';
import { ConfigManagerUpsertReq } from './dtos/config-manager-upsert-req.dto';
import { CacheManagerService } from './services/cache-manager.service';

@ApiTags('Cache-Manager')
@Controller('caches/services')
export class CacheManagerController {
  constructor(private readonly cacheManagerService: CacheManagerService) {}

  @PostServiceId()
  @AccessTokenGuard()
  @Roles(Role.superadmin, Role.moderator)
  @OpenApi_Upsert()
  upsert(
    @QueryTTLServiceId() ttl: number,
    @ParamServiceId() serviceId: string,
    @ConfigManagerUpsertBody() req: ConfigManagerUpsertReq[],
  ) {
    return this.cacheManagerService.upsert(serviceId, req, ttl);
  }

  @GetServiceId()
  @AccessTokenGuard()
  @Roles(Role.superadmin, Role.moderator, Role.consumer)
  @OpenApi_GetByServiceId()
  getByServiceId(@ParamServiceId() serviceId: string) {
    return this.cacheManagerService.getByServiceId(serviceId);
  }

  @GetConfigIds()
  @AccessTokenGuard()
  @Roles(Role.superadmin, Role.moderator, Role.consumer)
  @OpenApi_GetByServiceIdConfigIds()
  async getByServiceIdConfigIds(
    @ParamServiceId() serviceId: string,
    @ParamConfigIds() configIds: string[],
  ) {
    const ids = Array.from(new Set(configIds.filter((e) => e)));
    const cache = await this.cacheManagerService.getByServiceIdConfigIds(
      serviceId,
      ids,
    );

    const objKeys = Object.keys(cache);
    const keys = ids.filter((id) => objKeys.includes(id));

    if (!objKeys.length)
      throw new UnprocessableEntityException(`N/A serviceId: ${serviceId}`);

    if (keys.length < ids.length)
      throw new UnprocessableEntityException(
        `N/A configId: ${configIds.filter(
          (id) => !keys.find((k) => k === id),
        )}`,
      );

    return cache;
  }

  @DeleteServiceId()
  @AccessTokenGuard()
  @Roles(Role.superadmin, Role.moderator)
  @OpenApi_DeleteByServiceId()
  deleteByServiceId(@ParamServiceId() serviceId: string) {
    return this.cacheManagerService.deleteByServiceId(serviceId);
  }

  @DeleteConfigIds()
  @AccessTokenGuard()
  @Roles(Role.superadmin, Role.moderator)
  @OpenApi_DeleteByServiceIdConfigIds()
  deleteByServiceIdConfigIds(
    @ParamServiceId() serviceId: string,
    @ParamConfigIds() configIds: string[],
  ) {
    const ids = Array.from(new Set(configIds.filter((e) => e)));
    return this.cacheManagerService.deleteByServiceIdConfigId(serviceId, ids);
  }
}
