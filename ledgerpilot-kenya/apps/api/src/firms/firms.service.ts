import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@ledgerpilot/database';

@Injectable()
export class FirmsService {
  constructor(private readonly prisma: PrismaClient) {}

  async findOne(id: string) {
    const firm = await this.prisma.firm.findUnique({ where: { id } });
    if (!firm) throw new NotFoundException('Firm not found');
    return firm;
  }

  async update(id: string, data: Record<string, unknown>) {
    return this.prisma.firm.update({ where: { id }, data });
  }
}
