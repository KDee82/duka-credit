import { Injectable } from '@nestjs/common';
import { PrismaClient, DocumentStatus } from '@ledgerpilot/database';
import * as crypto from 'crypto';

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaClient) {}

  findAll(companyId: string, filters: { status?: string; type?: string }) {
    return this.prisma.document.findMany({
      where: {
        companyId,
        ...(filters.status && { status: filters.status as DocumentStatus }),
        ...(filters.type && { type: filters.type as never }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async upload(
    file: Express.Multer.File,
    body: { companyId: string; type: string; uploadedBy: string },
  ) {
    const fileHash = crypto.createHash('sha256').update(file.buffer).digest('hex');

    // Check for duplicate by hash
    const existing = await this.prisma.document.findFirst({
      where: { companyId: body.companyId, fileHash },
    });

    const storageKey = `${body.companyId}/${Date.now()}-${file.originalname}`;

    // In production: upload file.buffer to S3/R2 and get storageUrl
    // For now we store locally and set storageUrl to the key
    const doc = await this.prisma.document.create({
      data: {
        companyId: body.companyId,
        type: body.type as never,
        status: existing ? DocumentStatus.DUPLICATE : DocumentStatus.UPLOADED,
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        storageKey,
        fileHash,
        uploadedBy: body.uploadedBy,
        isDuplicate: !!existing,
        duplicateOfId: existing?.id,
      },
    });

    return doc;
  }

  updateStatus(id: string, status: string, reason?: string) {
    return this.prisma.document.update({
      where: { id },
      data: {
        status: status as DocumentStatus,
        ...(reason && { rejectionReason: reason }),
      },
    });
  }

  async missingDocumentReport(companyId: string) {
    const [needsReview, missingDetails, etimsRequired] = await Promise.all([
      this.prisma.document.count({ where: { companyId, status: 'NEEDS_REVIEW' } }),
      this.prisma.document.count({ where: { companyId, status: 'MISSING_DETAILS' } }),
      this.prisma.document.count({ where: { companyId, status: 'ETIMS_REQUIRED' } }),
    ]);

    const [billsWithoutDocs, expensesWithoutEtims] = await Promise.all([
      this.prisma.bill.count({ where: { companyId, documents: { none: {} } } }),
      this.prisma.bill.count({ where: { companyId, hasEtims: false, status: { not: 'VOID' } } }),
    ]);

    return {
      needsReview,
      missingDetails,
      etimsRequired,
      billsWithoutDocs,
      expensesWithoutEtims,
      totalIssues: needsReview + missingDetails + etimsRequired + billsWithoutDocs,
    };
  }
}
