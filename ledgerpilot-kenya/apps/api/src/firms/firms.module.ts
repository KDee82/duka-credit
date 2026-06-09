import { Module } from '@nestjs/common';
import { FirmsController } from './firms.controller';
import { FirmsService } from './firms.service';
import { PermissionsGuard } from '../common/guards/permissions.guard';

@Module({
  controllers: [FirmsController],
  providers: [FirmsService, PermissionsGuard],
  exports: [FirmsService],
})
export class FirmsModule {}
