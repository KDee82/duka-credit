import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaClient } from '@ledgerpilot/database';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { Permission, getFirmPermissions, getClientPermissions } from '../permissions';
import { JwtPayload } from '../decorators/current-user.decorator';

interface RequestWithUser {
  user: JwtPayload;
  params: Record<string, string>;
}

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaClient,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<Permission[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required || required.length === 0) return true;

    const req = context.switchToHttp().getRequest<RequestWithUser>();
    const userId = req.user?.sub;
    if (!userId) throw new ForbiddenException('Not authenticated');

    const { firmId, companyId } = req.params;

    // Check firm-level permissions
    if (firmId) {
      const firmUser = await this.prisma.firmUser.findUnique({
        where: { firmId_userId: { firmId, userId } },
      });
      if (firmUser?.isActive) {
        const perms = getFirmPermissions(firmUser.role);
        if (required.every((p) => perms.includes(p))) return true;
      }
    }

    // Check company-level permissions
    if (companyId) {
      const companyUser = await this.prisma.companyUser.findUnique({
        where: { companyId_userId: { companyId, userId } },
      });
      if (companyUser?.isActive) {
        const perms = getClientPermissions(companyUser.role);
        if (required.every((p) => perms.includes(p))) return true;
      }
    }

    throw new ForbiddenException('Insufficient permissions');
  }
}
