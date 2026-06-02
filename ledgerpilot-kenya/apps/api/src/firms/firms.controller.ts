import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FirmsService } from './firms.service';

@ApiTags('firms')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('firms')
export class FirmsController {
  constructor(private readonly firmsService: FirmsService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.firmsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Record<string, unknown>) {
    return this.firmsService.update(id, dto);
  }
}
