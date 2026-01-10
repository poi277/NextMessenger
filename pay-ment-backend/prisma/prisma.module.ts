// src/prisma/prisma.module.ts
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService], // 다른 모듈에서 사용 가능하도록 내보내기
})
export class PrismaModule {}