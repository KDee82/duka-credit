import { IsEmail, IsString, MinLength, MaxLength, IsOptional, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterFirmDto {
  @ApiProperty({ example: 'Wanjiku & Associates CPA' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  firmName!: string;

  @ApiPropertyOptional({ example: 'wanjiku-associates', description: 'URL slug (auto-generated if omitted)' })
  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9-]+$/, { message: 'Slug must be lowercase alphanumeric with hyphens' })
  @MaxLength(60)
  slug?: string;

  @ApiProperty({ example: 'jane@wanjiku.co.ke' })
  @IsEmail()
  ownerEmail!: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  ownerPassword!: string;

  @ApiProperty({ example: 'Jane' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  ownerFirstName!: string;

  @ApiProperty({ example: 'Wanjiku' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  ownerLastName!: string;

  @ApiPropertyOptional({ example: '+254712345678' })
  @IsOptional()
  @IsString()
  ownerPhone?: string;
}
