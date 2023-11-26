import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
/**
 * PrismaService is a class that extends PrismaClient and implements OnModuleInit and OnModuleDestroy interfaces.
 * It provides a connection to the database and methods for interacting with the data.
 */
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  /**
   * cleanDb is a method that deletes all data from the database by performing a transaction.
   * It deletes all posts and users.
   * @returns A Promise that resolves when the database is cleaned.
   */
  cleanDb() {
    return this.$transaction([this.post.deleteMany(), this.user.deleteMany()]);
  }
}
