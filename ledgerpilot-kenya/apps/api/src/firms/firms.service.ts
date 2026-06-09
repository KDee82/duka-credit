import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaClient } from '@ledgerpilot/database';
import * as argon2 from 'argon2';
import { RegisterFirmDto } from './dto/register-firm.dto';
import { UpdateFirmDto } from './dto/update-firm.dto';

function buildSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60);
}

@Injectable()
export class FirmsService {
  constructor(private readonly prisma: PrismaClient) {}

  async register(dto: RegisterFirmDto) {
    const slug = dto.slug ?? buildSlug(dto.firmName);

    const existing = await this.prisma.firm.findUnique({ where: { slug } });
    if (existing) throw new ConflictException('Firm slug already taken');

    const emailTaken = await this.prisma.user.findUnique({ where: { email: dto.ownerEmail } });
    if (emailTaken) throw new ConflictException('Email already registered');

    const passwordHash = await argon2.hash(dto.ownerPassword);

    const firm = await this.prisma.$transaction(async (tx) => {
      const newFirm = await tx.firm.create({
        data: {
          name: dto.firmName,
          slug,
          email: dto.ownerEmail,
        },
      });

      const user = await tx.user.create({
        data: {
          email: dto.ownerEmail,
          passwordHash,
          firstName: dto.ownerFirstName,
          lastName: dto.ownerLastName,
          phone: dto.ownerPhone,
          emailVerified: false,
        },
      });

      await tx.firmUser.create({
        data: {
          firmId: newFirm.id,
          userId: user.id,
          role: 'FIRM_OWNER',
          acceptedAt: new Date(),
        },
      });

      return newFirm;
    });

    return { firmId: firm.id, slug: firm.slug, message: 'Firm registered. Please verify your email.' };
  }

  async findOne(id: string) {
    const firm = await this.prisma.firm.findUnique({
      where: { id },
      include: { subscription: true, _count: { select: { companies: true, users: true } } },
    });
    if (!firm) throw new NotFoundException('Firm not found');
    return firm;
  }

  async update(id: string, dto: UpdateFirmDto) {
    if (dto.subdomain) {
      const conflict = await this.prisma.firm.findFirst({
        where: { subdomain: dto.subdomain, id: { not: id } },
      });
      if (conflict) throw new ConflictException('Subdomain already taken');
    }
    return this.prisma.firm.update({ where: { id }, data: dto });
  }

  async getDashboard(firmId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalCompanies,
      activeCompanies,
      totalStaff,
      overdueObligations,
      pendingDocuments,
      recentActivity,
      companyHealthSnapshot,
    ] = await Promise.all([
      this.prisma.clientCompany.count({ where: { firmId } }),
      this.prisma.clientCompany.count({ where: { firmId, status: 'ACTIVE' } }),
      this.prisma.firmUser.count({ where: { firmId, isActive: true } }),
      this.prisma.taxObligation_.count({
        where: { company: { firmId }, status: 'OVERDUE' },
      }),
      this.prisma.document.count({
        where: { company: { firmId }, status: { in: ['NEEDS_REVIEW', 'MISSING_DETAILS'] } },
      }),
      this.prisma.auditLog.findMany({
        where: {
          company: { firmId },
          createdAt: { gte: startOfMonth },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { user: { select: { firstName: true, lastName: true } } },
      }),
      this.prisma.clientCompany.findMany({
        where: { firmId, status: 'ACTIVE' },
        select: { id: true, name: true, healthScore: true, status: true },
        orderBy: { healthScore: 'asc' },
        take: 5,
      }),
    ]);

    return {
      stats: { totalCompanies, activeCompanies, totalStaff, overdueObligations, pendingDocuments },
      recentActivity,
      companyHealthSnapshot,
    };
  }
}
