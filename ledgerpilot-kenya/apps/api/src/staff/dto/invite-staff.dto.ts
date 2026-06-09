import { IsEmail, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FirmRole } from '@ledgerpilot/database';

export class InviteStaffDto {
  @ApiProperty({ example: 'bookkeeper@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ enum: FirmRole })
  @IsEnum(FirmRole)
  role!: FirmRole;
}
