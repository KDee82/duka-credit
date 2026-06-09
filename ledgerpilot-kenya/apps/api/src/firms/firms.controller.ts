import { Body, Controller, Get, HttpCode, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FirmsService } from './firms.service';
import { RegisterFirmDto } from './dto/register-firm.dto';
import { UpdateFirmDto } from './dto/update-firm.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';

@ApiTags('firms')
@Controller('firms')
export class FirmsController {
  constructor(private readonly firmsService: FirmsService) {}

  @Post('register')
  @HttpCode(201)
  @ApiOperation({ summary: 'Register a new accounting firm (creates firm + owner account)' })
  register(@Body() dto: RegisterFirmDto) {
    return this.firmsService.register(dto);
  }

  @Get(':firmId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions('firm:read')
  @ApiOperation({ summary: 'Get firm profile' })
  findOne(@Param('firmId') firmId: string) {
    return this.firmsService.findOne(firmId);
  }

  @Patch(':firmId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions('firm:update')
  @ApiOperation({ summary: 'Update firm profile' })
  update(@Param('firmId') firmId: string, @Body() dto: UpdateFirmDto) {
    return this.firmsService.update(firmId, dto);
  }

  @Get(':firmId/dashboard')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions('firm:read')
  @ApiOperation({ summary: 'Get firm dashboard stats and recent activity' })
  dashboard(@Param('firmId') firmId: string) {
    return this.firmsService.getDashboard(firmId);
  }
}
