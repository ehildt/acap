import {
  Body,
  Param,
  ParseArrayPipe,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { Role, ROLES } from '../constants/role.enum';
import { ConfigManagerUpsertReq } from '../dtos/config-manager-upsert-req.dto';
import { AccessTokenAuthGuard } from '../guards/access-token.guard';
import { RolesGuard } from '../guards/roles.guard';

export const serviceId = ':serviceId';

export const serviceIdConfigIds = `${serviceId}/configs/:configIds`;
export const ServiceIdParam = () => Param('serviceId');

export const ConfigManagerUpsertBody = () =>
  Body(new ParseArrayPipe({ items: ConfigManagerUpsertReq }));

export const ConfigIdsParam = () =>
  Param('configIds', new ParseArrayPipe({ items: String }));

export const AccessTokenGuard = () =>
  UseGuards(AccessTokenAuthGuard, RolesGuard);

export const Roles = (...roles: Role[]) => SetMetadata(ROLES, roles);
