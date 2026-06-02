import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@ledgerpilot/database';
import { KENYA_SME_ACCOUNTS } from '@ledgerpilot/database/prisma/seed';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(firmId: string) {
    return this.prisma.clientCompany.findMany({
      where: { firmId },
      include: {
        assignments: { include: { firmUser: { include: { user: true } } } },
        _count: { select: { employees: true, documents: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const company = await this.prisma.clientCompany.findUnique({
      where: { id },
      include: { bankAccounts: true, users: { include: { user: true } } },
    });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async create(data: Record<string, unknown>) {
    const company = await this.prisma.clientCompany.create({ data: data as never });

    // Seed default Kenya SME chart of accounts
    await this.prisma.account.createMany({
      data: KENYA_SME_ACCOUNTS.map((a) => ({
        companyId: company.id,
        code: a.code,
        name: a.name,
        type: a.type,
        subType: a.subType,
        isSystem: true,
      })),
    });

    return company;
  }

  async update(id: string, data: Record<string, unknown>) {
    return this.prisma.clientCompany.update({ where: { id }, data: data as never });
  }

  async calculateHealthScore(id: string): Promise<{ score: number; breakdown: Record<string, number> }> {
    const company = await this.findOne(id);
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const [monthlyClose, unreconciledCount, overdueObligations, pendingDocs] = await Promise.all([
      this.prisma.monthlyClose.findFirst({
        where: { companyId: id, year: currentYear, month: currentMonth },
      }),
      this.prisma.bankStatementLine.count({
        where: {
          statement: { bankAccount: { companyId: id } },
          status: 'UNRECONCILED',
        },
      }),
      this.prisma.taxObligation_.count({
        where: { companyId: id, status: 'OVERDUE' },
      }),
      this.prisma.document.count({
        where: { companyId: id, status: { in: ['NEEDS_REVIEW', 'MISSING_DETAILS'] } },
      }),
    ]);

    const closeScore   = monthlyClose?.status === 'LOCKED' ? 30 : 0;
    const reconScore   = unreconciledCount === 0 ? 25 : Math.max(0, 25 - unreconciledCount);
    const taxScore     = overdueObligations === 0 ? 25 : Math.max(0, 25 - overdueObligations * 5);
    const documentScore = pendingDocs === 0 ? 20 : Math.max(0, 20 - pendingDocs * 2);

    const total = closeScore + reconScore + taxScore + documentScore;

    await this.prisma.clientCompany.update({
      where: { id },
      data: { healthScore: total },
    });

    return {
      score: total,
      breakdown: { closeScore, reconScore, taxScore, documentScore },
    };
  }
}
