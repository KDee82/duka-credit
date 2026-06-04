import { Injectable } from '@nestjs/common';
import { PrismaClient, AuditAction } from '@ledgerpilot/database';

export interface LogAuditParams {
  userId: string;
  companyId?: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  reason?: string;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaClient) {}

  async log(params: LogAuditParams): Promise<void> {
    await this.prisma.auditLog.create({ data: params });
  }

  async query(filters: {
    companyId?: string;
    userId?: string;
    entityType?: string;
    action?: AuditAction;
    from?: Date;
    to?: Date;
    page?: number;
    limit?: number;
  }) {
    const { companyId, userId, entityType, action, from, to, page = 1, limit = 50 } = filters;
    const skip = (page - 1) * limit;

    const where = {
      ...(companyId && { companyId }),
      ...(userId && { userId }),
      ...(entityType && { entityType }),
      ...(action && { action }),
      ...(from || to
        ? { createdAt: { ...(from && { gte: from }), ...(to && { lte: to }) } }
        : {}),
    };

    const [total, records] = await Promise.all([
      this.prisma.auditLog.count({ where }),
      this.prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true } },
        },
      }),
    ]);

    return { total, page, limit, records };
  }
}
