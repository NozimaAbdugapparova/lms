import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "@prisma/client";
import { Pool } from "pg";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy, OnModuleInit{
    constructor(){
        const connectionString = process.env.DATABASE_URL 
        const pool = new Pool({connectionString})
        const adapter = new PrismaPg(pool)
        super({adapter, log:['warn', 'error']})
    }

    async onModuleInit() {
        await this.$connect()
        Logger.log("Prisma connected ✅")
    }

    async onModuleDestroy() {
        await this.$disconnect()
        Logger.log("Prisma disconnected ❌")
    }
}