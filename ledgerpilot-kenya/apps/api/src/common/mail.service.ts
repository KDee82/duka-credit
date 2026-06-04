import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly appUrl: string;

  constructor(private readonly config: ConfigService) {
    this.appUrl = this.config.get<string>('APP_URL', 'http://localhost:3000');
  }

  async sendEmailVerification(email: string, token: string): Promise<void> {
    const link = `${this.appUrl}/verify-email?token=${token}`;
    this.logger.log(`[EMAIL] Verify email → ${email}: ${link}`);
    // TODO: wire up nodemailer / Resend / SES in production
  }

  async sendPasswordReset(email: string, token: string): Promise<void> {
    const link = `${this.appUrl}/reset-password?token=${token}`;
    this.logger.log(`[EMAIL] Password reset → ${email}: ${link}`);
  }

  async sendStaffInvitation(
    email: string,
    token: string,
    firmName: string,
    role: string,
  ): Promise<void> {
    const link = `${this.appUrl}/accept-invite?token=${token}`;
    this.logger.log(`[EMAIL] Staff invite → ${email} (${role} at ${firmName}): ${link}`);
  }

  async sendClientInvitation(
    email: string,
    token: string,
    firmName: string,
    companyName: string,
  ): Promise<void> {
    const link = `${this.appUrl}/client-onboarding?token=${token}`;
    this.logger.log(
      `[EMAIL] Client invite → ${email} (${companyName} via ${firmName}): ${link}`,
    );
  }
}
