import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit{
    private client : Redis
    onModuleInit() {
        this.client = new Redis({
            host: process.env.HOST || 'localhost'
        })
    }

    async set(key: string, value: string){
        await this.client.set(key, value, 'EX', 120)
    }

    async get(key: string){
        return this.client.get(key)
    }

    async del(key : string){
        this.client.del(key)
    }
}
