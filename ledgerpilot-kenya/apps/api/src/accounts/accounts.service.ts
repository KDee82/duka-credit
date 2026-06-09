import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@ledgerpilot/database';

@Injectable()
export class AccountsService {
  constructor(private readonly prisma: PrismaClient) {}

  findAll(companyId: string) {
    return this.prisma.account.findMany({
      where: { companyId, isActive: true },
      orderBy: [{ type: 'asc' }, { code: 'asc' }],
    });
  }

  async trialBalance(companyId: string, asAt: Date) {
    const accounts = await this.prisma.account.findMany({
      where: { companyId, isActive: true },
      include: {
        debitLines: {
          where: {
            journalEntry: { isPosted: true, entryDate: { lte: asAt }, companyId },
          },
        },
        creditLines: {
          where: {
            journalEntry: { isPosted: true, entryDate: { lte: asAt }, companyId },
          },
        },
      },
      orderBy: { code: 'asc' },
    });

    return accounts.map((acc) => {
      const totalDebits = acc.debitLines.reduce((s, l) => s + Number(l.amount), 0);
      const totalCredits = acc.creditLines.reduce((s, l) => s + Number(l.amount), 0);
      return {
        code: acc.code,
        name: acc.name,
        type: acc.type,
        subType: acc.subType,
        debit: totalDebits,
        credit: totalCredits,
        balance: totalDebits - totalCredits,
      };
    });
  }
}
