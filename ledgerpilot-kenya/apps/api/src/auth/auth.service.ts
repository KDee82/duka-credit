import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@ledgerpilot/database';
import * as argon2 from 'argon2';
import { authenticator } from 'otplib';
import { v4 as uuidv4 } from 'uuid';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !user.isActive) throw new UnauthorizedException('Invalid credentials');

    const valid = await argon2.verify(user.passwordHash, dto.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    if (user.totpEnabled) {
      if (!dto.totpCode) {
        return { requiresTotp: true };
      }
      const totpValid = authenticator.verify({
        token: dto.totpCode,
        secret: user.totpSecret!,
      });
      if (!totpValid) throw new UnauthorizedException('Invalid authenticator code');
    }

    const session = await this.prisma.userSession.create({
      data: {
        userId: user.id,
        refreshToken: uuidv4(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const accessToken = this.jwt.sign({
      sub: user.id,
      sessionId: session.id,
    });

    return {
      accessToken,
      refreshToken: session.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
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

    const accessToken = this.jwt.sign({
      sub: session.userId,
      sessionId: session.id,
    });

    return { accessToken };
  }

  async logout(sessionId: string) {
    await this.prisma.userSession.deleteMany({ where: { id: sessionId } });
  }
}
