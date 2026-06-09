import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CompaniesService } from '../companies.service';
import { MailService } from '../../common/mail.service';

const mockCompany = {
  id: 'company-1',
  firmId: 'firm-1',
  name: 'Simba Traders Ltd',
  status: 'ACTIVE',
  healthScore: 0,
  bankAccounts: [],
  users: [],
  assignments: [],
};

const mockPrisma = {
  firm: { findUnique: jest.fn() },
  clientCompany: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  account: { createMany: jest.fn() },
  monthlyClose: { findFirst: jest.fn() },
  bankStatementLine: { count: jest.fn() },
  taxObligation_: { count: jest.fn() },
  document: { count: jest.fn() },
  verificationToken: { findFirst: jest.fn(), create: jest.fn() },
  user: { findUnique: jest.fn() },
  companyUser: { findUnique: jest.fn() },
};

const mockMail = { sendClientInvitation: jest.fn().mockResolvedValue(undefined) };

describe('CompaniesService', () => {
  let service: CompaniesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        { provide: 'PrismaClient', useValue: mockPrisma },
        { provide: MailService, useValue: mockMail },
      ],
    })
      .overrideProvider('PrismaClient')
      .useValue(mockPrisma)
      .compile();

    service = module.get<CompaniesService>(CompaniesService);
    jest.clearAllMocks();
  });

  describe('findOne', () => {
    it('throws NotFoundException for unknown company', async () => {
      mockPrisma.clientCompany.findUnique.mockResolvedValue(null);
      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
    });

    it('returns company with relations', async () => {
      mockPrisma.clientCompany.findUnique.mockResolvedValue(mockCompany);
      const result = await service.findOne('company-1');
      expect(result.name).toBe('Simba Traders Ltd');
    });
  });

  describe('archive', () => {
    it('archives an active company', async () => {
      mockPrisma.clientCompany.findUnique.mockResolvedValue(mockCompany);
      mockPrisma.clientCompany.update.mockResolvedValue({ ...mockCompany, status: 'ARCHIVED' });
      const result = await service.archive('company-1');
      expect(result.status).toBe('ARCHIVED');
    });

    it('throws if company not found', async () => {
      mockPrisma.clientCompany.findUnique.mockResolvedValue(null);
      await expect(service.archive('ghost')).rejects.toThrow(NotFoundException);
    });
  });

  describe('calculateHealthScore', () => {
    it('returns 100 for a fully healthy company', async () => {
      mockPrisma.clientCompany.findUnique.mockResolvedValue(mockCompany);
      mockPrisma.monthlyClose.findFirst.mockResolvedValue({ status: 'LOCKED' });
      mockPrisma.bankStatementLine.count.mockResolvedValue(0);
      mockPrisma.taxObligation_.count.mockResolvedValue(0);
      mockPrisma.document.count.mockResolvedValue(0);
      mockPrisma.clientCompany.update.mockResolvedValue({ ...mockCompany, healthScore: 100 });

      const result = await service.calculateHealthScore('company-1');
      expect(result.score).toBe(100);
      expect(result.breakdown.closeScore).toBe(30);
      expect(result.breakdown.reconScore).toBe(25);
    });

    it('returns 0 for a company with no close and many issues', async () => {
      mockPrisma.clientCompany.findUnique.mockResolvedValue(mockCompany);
      mockPrisma.monthlyClose.findFirst.mockResolvedValue(null);
      mockPrisma.bankStatementLine.count.mockResolvedValue(100);
      mockPrisma.taxObligation_.count.mockResolvedValue(10);
      mockPrisma.document.count.mockResolvedValue(20);
      mockPrisma.clientCompany.update.mockResolvedValue({ ...mockCompany, healthScore: 0 });

      const result = await service.calculateHealthScore('company-1');
      expect(result.score).toBe(0);
    });
  });
});
