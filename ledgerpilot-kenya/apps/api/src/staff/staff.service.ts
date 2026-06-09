import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaClient } from '@ledgerpilot/database';
import * as argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from '../common/mail.service';
import { InviteStaffDto } from './dto/invite-staff.dto';
import { UpdateStaffRoleDto } from './dto/update-staff-role.dto';
import { AcceptInviteDto } from './dto/accept-invite.dto';

const INVITE_TTL_HOURS = 72;

@Injectable()
export class StaffService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly mail: MailService,
  ) {}

  async list(firmId: string) {
    return this.prisma.firmUser.findMany({
      where: { firmId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            lastLoginAt: true,
            isActive: true,
          },
        },
      },
      orderBy: [{ isActive: 'desc' }, { role: 'asc' }],
    });
  }

  async invite(firmId: string, dto: InviteStaffDto, invitedById: string) {
    const firm = await this.prisma.firm.findUnique({ where: { id: firmId } });
    if (!firm) throw new NotFoundException('Firm not found');

    const existingUser = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existingUser) {
      const alreadyMember = await this.prisma.firmUser.findUnique({
        where: { firmId_userId: { firmId, userId: existingUser.id } },
      });
      if (alreadyMember) throw new ConflictException('User is already a member of this firm');
    }

    const pendingInvite = await this.prisma.verificationToken.findFirst({
      where: {
        email: dto.email,
        purpose: 'STAFF_INVITATION',
        usedAt: null,
        expiresAt: { gt: new Date() },
        metadata: { path: ['firmId'], equals: firmId },
      },
    });
    if (pendingInvite) throw new ConflictException('An active invitation already exists for this email');

    const token = uuidv4();
    await this.prisma.verificationToken.create({
      data: {
        userId: existingUser?.id,
        token,
        purpose: 'STAFF_INVITATION',
        email: dto.email,
        metadata: { firmId, role: dto.role, invitedById },
        expiresAt: new Date(Date.now() + INVITE_TTL_HOURS * 60 * 60 * 1000),
      },
    });

    await this.mail.sendStaffInvitation(dto.email, token, firm.name, dto.role);

    return { message: `Invitation sent to ${dto.email}` };
  }

  async acceptInvite(dto: AcceptInviteDto) {
    const record = await this.prisma.verificationToken.findUnique({
      where: { token: dto.token },
    });

    if (!record || record.purpose !== 'STAFF_INVITATION') {
      throw new BadRequestException('Invalid or expired invitation');
    }
    if (record.usedAt) throw new BadRequestException('Invitation already used');
    if (record.expiresAt < new Date()) throw new BadRequestException('Invitation has expired');

    const meta = record.metadata as { firmId: string; role: string };
    const firm = await this.prisma.firm.findUnique({ where: { id: meta.firmId } });
    if (!firm) throw new NotFoundException('Firm not found');

    const result = await this.prisma.$transaction(async (tx) => {
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

      const firmUser = await tx.firmUser.upsert({
        where: { firmId_userId: { firmId: meta.firmId, userId: user.id } },
        update: { role: meta.role as never, isActive: true, acceptedAt: new Date() },
        create: {
          firmId: meta.firmId,
          userId: user.id,
          role: meta.role as never,
          isActive: true,
          acceptedAt: new Date(),
        },
      });

      await tx.verificationToken.update({
        where: { id: record.id },
        data: { usedAt: new Date(), userId: user.id },
      });

      return { userId: user.id, firmUserId: firmUser.id };
    });

    return { message: 'Invitation accepted. You can now log in.', ...result };
  }

  async updateRole(firmId: string, staffId: string, dto: UpdateStaffRoleDto, requesterId: string) {
    const requester = await this.prisma.firmUser.findUnique({
      where: { firmId_userId: { firmId, userId: requesterId } },
    });
    if (!requester || !['FIRM_OWNER', 'FIRM_ADMIN'].includes(requester.role)) {
      throw new ForbiddenException('Only firm owners and admins can change roles');
    }

    const target = await this.prisma.firmUser.findUnique({ where: { id: staffId } });
    if (!target || target.firmId !== firmId) throw new NotFoundException('Staff member not found');

    if (target.role === 'FIRM_OWNER' && dto.role !== 'FIRM_OWNER') {
      const ownerCount = await this.prisma.firmUser.count({
        where: { firmId, role: 'FIRM_OWNER', isActive: true },
      });
      if (ownerCount <= 1) throw new BadRequestException('Firm must have at least one owner');
    }

    return this.prisma.firmUser.update({ where: { id: staffId }, data: { role: dto.role } });
  }

  async deactivate(firmId: string, staffId: string, requesterId: string) {
    const requester = await this.prisma.firmUser.findUnique({
      where: { firmId_userId: { firmId, userId: requesterId } },
    });
    if (!requester || !['FIRM_OWNER', 'FIRM_ADMIN'].includes(requester.role)) {
      throw new ForbiddenException('Only firm owners and admins can deactivate staff');
    }

    const target = await this.prisma.firmUser.findUnique({ where: { id: staffId } });
    if (!target || target.firmId !== firmId) throw new NotFoundException('Staff member not found');

    if (target.role === 'FIRM_OWNER') {
      const ownerCount = await this.prisma.firmUser.count({
        where: { firmId, role: 'FIRM_OWNER', isActive: true },
      });
      if (ownerCount <= 1) throw new BadRequestException('Cannot deactivate the only firm owner');
    }

    return this.prisma.firmUser.update({ where: { id: staffId }, data: { isActive: false } });
  }
}
