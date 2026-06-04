import { Module } from '@nestjs/common';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';
import { AuditInterceptor } from './audit.interceptor';
import { PermissionsGuard } from '../common/guards/permissions.guard';

@Module({
  controllers: [AuditController],
  providers: [AuditService, AuditInterceptor, PermissionsGuard],
  exports: [AuditService, AuditInterceptor],
})
export class AuditModule {}
