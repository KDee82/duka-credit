import { Module } from '@nestjs/common';
import {
  CompaniesController,
  CompanyDetailController,
  ClientOnboardingController,
} from './companies.controller';
import { CompaniesService } from './companies.service';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { MailService } from '../common/mail.service';

@Module({
  controllers: [CompaniesController, CompanyDetailController, ClientOnboardingController],
  providers: [CompaniesService, PermissionsGuard, MailService],
  exports: [CompaniesService],
})
export class CompaniesModule {}
