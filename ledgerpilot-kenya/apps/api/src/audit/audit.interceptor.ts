import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from './audit.service';
import { AuditAction } from '@ledgerpilot/database';
import { JwtPayload } from '../common/decorators/current-user.decorator';

export const AUDIT_ACTION_KEY = 'audit_action';
export const AUDIT_ENTITY_KEY = 'audit_entity';

export function AuditLog(action: AuditAction, entityType: string) {
  return (target: object, key: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(AUDIT_ACTION_KEY, action, descriptor.value as object);
    Reflect.defineMetadata(AUDIT_ENTITY_KEY, entityType, descriptor.value as object);
    return descriptor;
  };
}

interface AuditRequest {
  user?: JwtPayload;
  params: Record<string, string>;
  ip: string;
  headers: Record<string, string>;
  method: string;
  url: string;
}

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly auditService: AuditService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const action = this.reflector.get<AuditAction>(AUDIT_ACTION_KEY, context.getHandler());
    const entityType = this.reflector.get<string>(AUDIT_ENTITY_KEY, context.getHandler());

    if (!action || !entityType) return next.handle();

    const req = context.switchToHttp().getRequest<AuditRequest>();
    const userId = req.user?.sub;
    if (!userId) return next.handle();

    return next.handle().pipe(
      tap((result: { id?: string } | null) => {
        const entityId = result?.id ?? req.params.id ?? req.params.companyId ?? 'unknown';
        const companyId = req.params.companyId;
        this.auditService
          .log({
            userId,
            companyId,
            action,
            entityType,
            entityId,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
          })
          .catch(() => undefined);
      }),
    );
  }
}
