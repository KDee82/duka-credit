import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FirmRole } from '@ledgerpilot/database';

export class UpdateStaffRoleDto {
  @ApiProperty({ enum: FirmRole })
  @IsEnum(FirmRole)
  role!: FirmRole;
}
