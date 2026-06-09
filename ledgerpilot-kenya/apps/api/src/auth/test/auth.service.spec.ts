import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { MailService } from '../../common/mail.service';

const mockUser = {
  id: 'user-1',
  email: 'jane@example.com',
  passwordHash: '',
  firstName: 'Jane',
  lastName: 'Wanjiru',
  phone: null,
  emailVerified: true,
  isActive: true,
  totpEnabled: false,
  totpSecret: null,
  loginAttempts: 0,
  lockedUntil: null,
  lastLoginAt: null,
  avatarUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockSession = {
  id: 'session-1',
  userId: 'user-1',
  refreshToken: 'refresh-token-uuid',
  deviceInfo: null,
  ipAddress: null,
  expiresAt: new Date(Date.now() + 86_400_000),
  createdAt: new Date(),
};

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  userSession: {
    create: jest.fn(),
    findUnique: jest.fn(),
    deleteMany: jest.fn(),
    findMany: jest.fn(),
    delete: jest.fn(),
  },
  verificationToken: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

const mockJwt = { sign: jest.fn().mockReturnValue('access-token') };
const mockConfig = { getOrThrow: jest.fn(), get: jest.fn().mockReturnValue('http://localhost:3000') };
const mockMail = {
  sendEmailVerification: jest.fn().mockResolvedValue(undefined),
  sendPasswordReset: jest.fn().mockResolvedValue(undefined),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: 'PrismaClient', useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
        { provide: ConfigService, useValue: mockConfig },
        { provide: MailService, useValue: mockMail },
      ],
    })
      .overrideProvider('PrismaClient')
      .useValue(mockPrisma)
      .compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('rejects duplicate email', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      await expect(
        service.register({
          email: 'jane@example.com',
          password: 'Password1!',
          firstName: 'Jane',
          lastName: 'Wanjiru',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('creates user and sends verification email', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({ ...mockUser, emailVerified: false });
      mockPrisma.verificationToken.create.mockResolvedValue({});

      const result = await service.register({
        email: 'new@example.com',
        password: 'Password1!',
        firstName: 'New',
        lastName: 'User',
      });

      expect(result.message).toContain('Registration successful');
      expect(mockMail.sendEmailVerification).toHaveBeenCalledWith('new@example.com', expect.any(String));
    });
  });

  describe('login', () => {
    it('rejects unknown user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await expect(
        service.login({ email: 'nobody@example.com', password: 'pass' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('rejects locked account', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        ...mockUser,
        lockedUntil: new Date(Date.now() + 600_000),
      });
      await expect(
        service.login({ email: 'jane@example.com', password: 'wrong' }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('returns requiresTotp when TOTP enabled and no code supplied', async () => {
      // argon2 can't be mocked easily; test with a real hash
      const argon2 = await import('argon2');
      const hash = await argon2.hash('Password1!');
      mockPrisma.user.findUnique.mockResolvedValue({
        ...mockUser,
        passwordHash: hash,
        totpEnabled: true,
        totpSecret: 'SECRET',
      });

      const result = await service.login({ email: 'jane@example.com', password: 'Password1!' });
      expect(result).toEqual({ requiresTotp: true });
    });
  });

  describe('refresh', () => {
    it('throws on expired session', async () => {
      mockPrisma.userSession.findUnique.mockResolvedValue({
        ...mockSession,
        expiresAt: new Date(Date.now() - 1000),
        user: mockUser,
      });
      await expect(service.refresh('stale-token')).rejects.toThrow(ForbiddenException);
    });

    it('returns new access token for valid session', async () => {
      mockPrisma.userSession.findUnique.mockResolvedValue({
        ...mockSession,
        user: mockUser,
      });
      const result = await service.refresh('refresh-token-uuid');
      expect(result.accessToken).toBe('access-token');
    });
  });

  describe('forgotPassword', () => {
    it('always returns success regardless of whether email exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      const result = await service.forgotPassword({ email: 'nobody@example.com' });
      expect(result.message).toContain('If that email exists');
      expect(mockMail.sendPasswordReset).not.toHaveBeenCalled();
    });

    it('sends reset email when user exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.verificationToken.create.mockResolvedValue({});
      await service.forgotPassword({ email: 'jane@example.com' });
      expect(mockMail.sendPasswordReset).toHaveBeenCalledWith('jane@example.com', expect.any(String));
    });
  });
});
