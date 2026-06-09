import { Module } from '@nestjs/common';
import { StaffController, StaffPublicController } from './staff.controller';
import { StaffService } from './staff.service';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { MailService } from '../common/mail.service';

@Module({
  controllers: [StaffController, StaffPublicController],
  providers: [StaffService, PermissionsGuard, MailService],
  exports: [StaffService],
})
export class StaffModule {}
