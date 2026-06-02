import { Global, Module } from '@nestjs/common';
import { PrismaClient } from '@ledgerpilot/database';

@Global()
@Module({
  providers: [
    {
      provide: PrismaClient,
      useFactory: () => {
        const prisma = new PrismaClient({
          log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
        });
        return prisma;
      },
    },
  ],
  exports: [PrismaClient],
})
export class DatabaseModule {}
