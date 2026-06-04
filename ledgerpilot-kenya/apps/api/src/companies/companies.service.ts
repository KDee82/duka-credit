import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaClient } from '@ledgerpilot/database';
import * as argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';
import { KENYA_SME_ACCOUNTS } from '@ledgerpilot/database/prisma/seed';
import { MailService } from '../common/mail.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { InviteClientDto } from './dto/invite-client.dto';
import { AcceptClientInviteDto } from './dto/accept-client-invite.dto';

const INVITE_TTL_HOURS = 72;

@Injectable()
export class CompaniesService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly mail: MailService,
  ) {}

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
      include: {
        bankAccounts: true,
        users: { include: { user: true } },
        assignments: { include: { firmUser: { include: { user: true } } } },
      },
    });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async create(firmId: string, dto: CreateCompanyDto) {
    const firm = await this.prisma.firm.findUnique({ where: { id: firmId } });
    if (!firm) throw new NotFoundException('Firm not found');

    const company = await this.prisma.clientCompany.create({
      data: { ...dto, firmId },
    });

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

  async update(id: string, data: Partial<CreateCompanyDto>) {
    return this.prisma.clientCompany.update({ where: { id }, data: data as never });
  }

  async archive(id: string) {
    const company = await this.prisma.clientCompany.findUnique({ where: { id } });
    if (!company) throw new NotFoundException('Company not found');
    if (company.status === 'ARCHIVED') throw new BadRequestException('Company is already archived');
    return this.prisma.clientCompany.update({ where: { id }, data: { status: 'ARCHIVED' } });
  }

  async restore(id: string) {
    const company = await this.prisma.clientCompany.findUnique({ where: { id } });
    if (!company) throw new NotFoundException('Company not found');
    return this.prisma.clientCompany.update({ where: { id }, data: { status: 'ACTIVE' } });
  }

  // ── Client Invitations ────────────────────────────────────────────────────

  async inviteClient(companyId: string, dto: InviteClientDto, invitedById: string) {
    const company = await this.prisma.clientCompany.findUnique({
      where: { id: companyId },
      include: { firm: true },
    });
    if (!company) throw new NotFoundException('Company not found');

    const existingUser = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existingUser) {
      const alreadyMember = await this.prisma.companyUser.findUnique({
        where: { companyId_userId: { companyId, userId: existingUser.id } },
      });
      if (alreadyMember) throw new ConflictException('User already has access to this company');
    }

    const pending = await this.prisma.verificationToken.findFirst({
      where: {
        email: dto.email,
        purpose: 'CLIENT_INVITATION',
        usedAt: null,
        expiresAt: { gt: new Date() },
        metadata: { path: ['companyId'], equals: companyId },
      },
    });
    if (pending) throw new ConflictException('An active invitation already exists');

    const token = uuidv4();
    await this.prisma.verificationToken.create({
      data: {
        userId: existingUser?.id,
        token,
        purpose: 'CLIENT_INVITATION',
        email: dto.email,
        metadata: { companyId, role: dto.role, firmId: company.firmId, invitedById },
        expiresAt: new Date(Date.now() + INVITE_TTL_HOURS * 60 * 60 * 1000),
      },
    });

    await this.mail.sendClientInvitation(
      dto.email,
      token,
      company.firm.name,
      company.name,
    );

    return { message: `Client invitation sent to ${dto.email}` };
  }

  async acceptClientInvite(dto: AcceptClientInviteDto) {
    const record = await this.prisma.verificationToken.findUnique({ where: { token: dto.token } });

    if (!record || record.purpose !== 'CLIENT_INVITATION') {
      throw new BadRequestException('Invalid or expired invitation');
    }
    if (record.usedAt) throw new BadRequestException('Invitation already used');
    if (record.expiresAt < new Date()) throw new BadRequestException('Invitation has expired');

    const meta = record.metadata as { companyId: string; role: string };

    await this.prisma.$transaction(async (tx) => {
      let user = await tx.user.findUnique({ where: { email: record.email } });
      if (!user) {
        const passwordHash = await argon2.hash(dto.password);
        user = await tx.user.create({
          data: {
            email: record.email,
            passwordHash,
            firstName: dto.firstName,
            lastName: dto.lastName,
            phone: dto.phone,
            emailVerified: true,
          },
        });
      }

      await tx.companyUser.upsert({
        where: { companyId_userId: { companyId: meta.companyId, userId: user.id } },
        update: { role: meta.role as never, isActive: true },
        create: {
          companyId: meta.companyId,
          userId: user.id,
          role: meta.role as never,
          isActive: true,
        },
      });

      await tx.verificationToken.update({
        where: { id: record.id },
        data: { usedAt: new Date(), userId: user.id },
      });
    });

    return { message: 'Invitation accepted. You can now log in.' };
  }

  // ── Health Score ───────────────────────────────────────────────────────────

  async calculateHealthScore(
    id: string,
  ): Promise<{ score: number; breakdown: Record<string, number> }> {
    await this.findOne(id);
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const [monthlyClose, unreconciledCount, overdueObligations, pendingDocs] = await Promise.all([
      this.prisma.monthlyClose.findFirst({
        where: { companyId: id, year: currentYear, month: currentMonth },
      }),
      this.prisma.bankStatementLine.count({
        where: { statement: { bankAccount: { companyId: id } }, status: 'UNRECONCILED' },
      }),
      this.prisma.taxObligation_.count({ where: { companyId: id, status: 'OVERDUE' } }),
      this.prisma.document.count({
        where: { companyId: id, status: { in: ['NEEDS_REVIEW', 'MISSING_DETAILS'] } },
      }),
    ]);

    const closeScore = monthlyClose?.status === 'LOCKED' ? 30 : 0;
    const reconScore = unreconciledCount === 0 ? 25 : Math.max(0, 25 - unreconciledCount);
    const taxScore = overdueObligations === 0 ? 25 : Math.max(0, 25 - overdueObligations * 5);
    const documentScore = pendingDocs === 0 ? 20 : Math.max(0, 20 - pendingDocs * 2);
    const total = closeScore + reconScore + taxScore + documentScore;

    await this.prisma.clientCompany.update({ where: { id }, data: { healthScore: total } });

    return { score: total, breakdown: { closeScore, reconScore, taxScore, documentScore } };
  }
}
