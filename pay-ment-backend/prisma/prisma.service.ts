import { Injectable, OnModuleInit } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    try {
      await this.$connect();
      console.log("✅ Prisma DB 연결 성공");
    } catch (err) {
      console.error("❌ Prisma DB 연결 실패:", err.message);
    }
  }
}
