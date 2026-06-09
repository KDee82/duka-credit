import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AccountsService } from './accounts.service';

@ApiTags('accounts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  findAll(@Query('companyId') companyId: string) {
    return this.accountsService.findAll(companyId);
  }

  @Get('trial-balance')
  trialBalance(@Query('companyId') companyId: string, @Query('asAt') asAt?: string) {
    return this.accountsService.trialBalance(companyId, asAt ? new Date(asAt) : new Date());
  }
}
