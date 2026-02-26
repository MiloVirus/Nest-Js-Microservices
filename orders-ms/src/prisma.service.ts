
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const adapter = new PrismaPg({ url: process.env.DATABASE_URL });
    super({ adapter });
  }
  
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('Database connected');
    } catch (error) {
      console.error('Database connection error:', error);
    }
  }
}
