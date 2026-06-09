import {
  IsString,
  IsOptional,
  IsEnum,
  IsEmail,
  IsBoolean,
  IsInt,
  Min,
  Max,
  MaxLength,
  MinLength,
  Matches,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VatStatus, Industry } from '@ledgerpilot/database';

export class CreateCompanyDto {
  @ApiProperty({ example: 'Simba Traders Ltd' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name!: string;

  @ApiPropertyOptional({ example: 'CPR/2024/12345' })
  @IsOptional()
  @IsString()
  registrationNumber?: string;

  @ApiPropertyOptional({ example: 'P051234567X' })
  @IsOptional()
  @IsString()
  @Matches(/^[A-Z]\d{9}[A-Z]$/, { message: 'Invalid KRA PIN format' })
  kraPin?: string;

  @ApiPropertyOptional({ enum: VatStatus, default: 'NOT_REGISTERED' })
  @IsOptional()
  @IsEnum(VatStatus)
  vatStatus?: VatStatus;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isTurnoverTax?: boolean;

  @ApiPropertyOptional({ enum: Industry, default: 'OTHER' })
  @IsOptional()
  @IsEnum(Industry)
  industry?: Industry;

  @ApiPropertyOptional({ example: 'Nairobi' })
  @IsOptional()
  @IsString()
  county?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({ minimum: 1, maximum: 12, default: 12 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  financialYearEnd?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
