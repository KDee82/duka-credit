import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@ledgerpilot/database';
import * as argon2 from 'argon2';
import { authenticator } from 'otplib';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from '../common/mail.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ConfirmTotpDto } from './dto/confirm-totp.dto';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;
const TOKEN_TTL_HOURS = 24;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly mail: MailService,
  ) {}

  // ── Registration ──────────────────────────────────────────────────────────

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await argon2.hash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
      },
    });

    const token = await this.createVerificationToken(
      user.id,
      user.email,
      'EMAIL_VERIFICATION',
    );
    await this.mail.sendEmailVerification(user.email, token);

    return { message: 'Registration successful. Check your email to verify your account.' };
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const record = await this.prisma.verificationToken.findUnique({
      where: { token: dto.token },
    });

    this.assertTokenValid(record, 'EMAIL_VERIFICATION');

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: record!.userId! },
        data: { emailVerified: true },
      }),
      this.prisma.verificationToken.update({
        where: { id: record!.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return { message: 'Email verified successfully.' };
  }

  // ── Login ─────────────────────────────────────────────────────────────────

  async login(dto: LoginDto, ipAddress?: string, deviceInfo?: string) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (!user || !user.isActive) throw new UnauthorizedException('Invalid credentials');

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const minutes = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60_000);
      throw new ForbiddenException(
        `Account locked. Try again in ${minutes} minute${minutes === 1 ? '' : 's'}.`,
      );
    }

    const valid = await argon2.verify(user.passwordHash, dto.password);
    if (!valid) {
      await this.recordFailedAttempt(user.id, user.loginAttempts);
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.totpEnabled) {
      if (!dto.totpCode) return { requiresTotp: true };
      const totpValid = authenticator.verify({
        token: dto.totpCode,
        secret: user.totpSecret!,
      });
      if (!totpValid) throw new UnauthorizedException('Invalid authenticator code');
    }

    // Clear failed attempts on success
    await this.prisma.user.update({
      where: { id: user.id },
      data: { loginAttempts: 0, lockedUntil: null, lastLoginAt: new Date() },
    });

    const session = await this.prisma.userSession.create({
      data: {
        userId: user.id,
        refreshToken: uuidv4(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        ipAddress,
        deviceInfo,
      },
    });

    const accessToken = this.signAccessToken(user.id, session.id);

    return {
      accessToken,
      refreshToken: session.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        emailVerified: user.emailVerified,
        totpEnabled: user.totpEnabled,
      },
    };
  }

  async refresh(refreshToken: string) {
    const session = await this.prisma.userSession.findUnique({
      where: { refreshToken },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date() || !session.user.isActive) {
      throw new ForbiddenException('Session expired or invalid');
    }

    const accessToken = this.signAccessToken(session.userId, session.id);
    return { accessToken };
  }

  async logout(sessionId: string) {
    await this.prisma.userSession.deleteMany({ where: { id: sessionId } });
  }

  async getSessions(userId: string) {
    return this.prisma.userSession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: { id: true, deviceInfo: true, ipAddress: true, createdAt: true, expiresAt: true },
    });
  }

  async revokeSession(userId: string, sessionId: string) {
    const session = await this.prisma.userSession.findUnique({ where: { id: sessionId } });
    if (!session || session.userId !== userId) throw new NotFoundException('Session not found');
    await this.prisma.userSession.delete({ where: { id: sessionId } });
  }

  // ── Password Reset ────────────────────────────────────────────────────────

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (user) {
      const token = await this.createVerificationToken(user.id, user.email, 'PASSWORD_RESET');
      await this.mail.sendPasswordReset(user.email, token);
    }
    // Always return success to prevent email enumeration
    return { message: 'If that email exists, a reset link has been sent.' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const record = await this.prisma.verificationToken.findUnique({
      where: { token: dto.token },
    });
    this.assertTokenValid(record, 'PASSWORD_RESET');

    const passwordHash = await argon2.hash(dto.password);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: record!.userId! },
        data: { passwordHash, loginAttempts: 0, lockedUntil: null },
      }),
      this.prisma.userSession.deleteMany({ where: { userId: record!.userId! } }),
      this.prisma.verificationToken.update({
        where: { id: record!.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return { message: 'Password reset successful. Please log in.' };
  }

  // ── TOTP ──────────────────────────────────────────────────────────────────

  async initTotp(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    if (user.totpEnabled) throw new BadRequestException('TOTP is already enabled');

    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(user.email, 'LedgerPilot Kenya', secret);

    await this.prisma.user.update({ where: { id: userId }, data: { totpSecret: secret } });

    return { secret, otpauthUrl };
  }

  async confirmTotp(userId: string, dto: ConfirmTotpDto) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    if (!user.totpSecret) throw new BadRequestException('TOTP setup not initiated');
    if (user.totpEnabled) throw new BadRequestException('TOTP is already enabled');

    const valid = authenticator.verify({ token: dto.code, secret: user.totpSecret });
    if (!valid) throw new BadRequestException('Invalid code');

    await this.prisma.user.update({ where: { id: userId }, data: { totpEnabled: true } });
    return { message: 'Two-factor authentication enabled.' };
  }

  async disableTotp(userId: string, dto: ConfirmTotpDto) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    if (!user.totpEnabled || !user.totpSecret) {
      throw new BadRequestException('TOTP is not enabled');
    }

    const valid = authenticator.verify({ token: dto.code, secret: user.totpSecret });
    if (!valid) throw new BadRequestException('Invalid code');

    await this.prisma.user.update({
      where: { id: userId },
      data: { totpEnabled: false, totpSecret: null },
    });
    return { message: 'Two-factor authentication disabled.' };
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  private signAccessToken(userId: string, sessionId: string) {
    return this.jwt.sign({ sub: userId, sessionId });
  }

  private async createVerificationToken(
    userId: string,
    email: string,
    purpose: 'EMAIL_VERIFICATION' | 'PASSWORD_RESET' | 'STAFF_INVITATION' | 'CLIENT_INVITATION',
  ) {
    const token = uuidv4();
    await this.prisma.verificationToken.create({
      data: {
        userId,
        token,
        purpose,
        email,
        expiresAt: new Date(Date.now() + TOKEN_TTL_HOURS * 60 * 60 * 1000),
      },
    });
    return token;
  }

  private assertTokenValid(
    record: { usedAt: Date | null; expiresAt: Date; purpose: string } | null,
    purpose: string,
  ) {
    if (!record || record.purpose !== purpose) {
      throw new BadRequestException('Invalid or expired token');
    }
    if (record.usedAt) throw new BadRequestException('Token already used');
    if (record.expiresAt < new Date()) throw new BadRequestException('Token expired');
  }

  private async recordFailedAttempt(userId: string, currentAttempts: number) {
    const attempts = currentAttempts + 1;
    const data: { loginAttempts: number; lockedUntil?: Date } = { loginAttempts: attempts };
    if (attempts >= MAX_LOGIN_ATTEMPTS) {
      data.lockedUntil = new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000);
    }
    await this.prisma.user.update({ where: { id: userId }, data });
  }
}
