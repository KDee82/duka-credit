import { IsEmail, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ClientRole } from '@ledgerpilot/database';

export class InviteClientDto {
  @ApiProperty({ example: 'owner@simbatraders.co.ke' })
  @IsEmail()
  email!: string;

  @ApiProperty({ enum: ClientRole, default: 'CLIENT_OWNER' })
  @IsEnum(ClientRole)
  role!: ClientRole;
}
