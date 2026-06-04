import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { StaffService } from './staff.service';
import { InviteStaffDto } from './dto/invite-staff.dto';
import { UpdateStaffRoleDto } from './dto/update-staff-role.dto';
import { AcceptInviteDto } from './dto/accept-invite.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';

@ApiTags('staff')
@Controller('firms/:firmId/staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions('firm:read')
  @ApiOperation({ summary: 'List all staff members in the firm' })
  list(@Param('firmId') firmId: string) {
    return this.staffService.list(firmId);
  }

  @Post('invite')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions('firm:manage_staff')
  @ApiOperation({ summary: 'Invite a staff member by email' })
  invite(
    @Param('firmId') firmId: string,
    @Body() dto: InviteStaffDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.staffService.invite(firmId, dto, user.sub);
  }

  @Patch(':staffId/role')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions('firm:manage_staff')
  @ApiOperation({ summary: 'Update a staff member role' })
  updateRole(
    @Param('firmId') firmId: string,
    @Param('staffId') staffId: string,
    @Body() dto: UpdateStaffRoleDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.staffService.updateRole(firmId, staffId, dto, user.sub);
  }

  @Delete(':staffId')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions('firm:manage_staff')
  @ApiOperation({ summary: 'Deactivate a staff member' })
  deactivate(
    @Param('firmId') firmId: string,
    @Param('staffId') staffId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.staffService.deactivate(firmId, staffId, user.sub);
  }
}

@ApiTags('staff')
@Controller('staff')
export class StaffPublicController {
  constructor(private readonly staffService: StaffService) {}

  @Post('accept-invite')
  @HttpCode(200)
  @ApiOperation({ summary: 'Accept a staff invitation and set up account' })
  acceptInvite(@Body() dto: AcceptInviteDto) {
    return this.staffService.acceptInvite(dto);
  }
}
