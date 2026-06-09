import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { InviteClientDto } from './dto/invite-client.dto';
import { AcceptClientInviteDto } from './dto/accept-client-invite.dto';

@ApiTags('companies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('firms/:firmId/companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  @RequirePermissions('company:read')
  @ApiOperation({ summary: 'List all client companies for a firm' })
  findAll(@Param('firmId') firmId: string) {
    return this.companiesService.findAll(firmId);
  }

  @Post()
  @HttpCode(201)
  @RequirePermissions('company:create')
  @ApiOperation({ summary: 'Create a new client company (seeds Kenya SME chart of accounts)' })
  create(@Param('firmId') firmId: string, @Body() dto: CreateCompanyDto) {
    return this.companiesService.create(firmId, dto);
  }
}

@ApiTags('companies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('companies')
export class CompanyDetailController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get(':companyId')
  @RequirePermissions('company:read')
  @ApiOperation({ summary: 'Get company profile and assignments' })
  findOne(@Param('companyId') companyId: string) {
    return this.companiesService.findOne(companyId);
  }

  @Patch(':companyId')
  @RequirePermissions('company:update')
  @ApiOperation({ summary: 'Update company profile' })
  update(@Param('companyId') companyId: string, @Body() dto: Partial<CreateCompanyDto>) {
    return this.companiesService.update(companyId, dto);
  }

  @Patch(':companyId/archive')
  @RequirePermissions('company:archive')
  @ApiOperation({ summary: 'Archive a client company' })
  archive(@Param('companyId') companyId: string) {
    return this.companiesService.archive(companyId);
  }

  @Patch(':companyId/restore')
  @RequirePermissions('company:archive')
  @ApiOperation({ summary: 'Restore an archived company' })
  restore(@Param('companyId') companyId: string) {
    return this.companiesService.restore(companyId);
  }

  @Post(':companyId/invite-client')
  @HttpCode(200)
  @RequirePermissions('company:invite_client')
  @ApiOperation({ summary: 'Send a client portal invitation email' })
  inviteClient(
    @Param('companyId') companyId: string,
    @Body() dto: InviteClientDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.companiesService.inviteClient(companyId, dto, user.sub);
  }

  @Get(':companyId/health-score')
  @RequirePermissions('company:read')
  @ApiOperation({ summary: 'Recalculate and return the company health score' })
  healthScore(@Param('companyId') companyId: string) {
    return this.companiesService.calculateHealthScore(companyId);
  }
}

@ApiTags('companies')
@Controller('client-onboarding')
export class ClientOnboardingController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post('accept')
  @HttpCode(200)
  @ApiOperation({ summary: 'Accept a client portal invitation and set up account' })
  accept(@Body() dto: AcceptClientInviteDto) {
    return this.companiesService.acceptClientInvite(dto);
  }
}
