import { SetMetadata } from '@nestjs/common';
import { Role, ROLES } from '../constants/role.enum';

export const Roles = (...roles: Role[]) => SetMetadata(ROLES, roles);
