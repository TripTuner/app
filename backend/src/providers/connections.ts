import { Connection, createConnection } from 'typeorm'
import { Redis } from "ioredis";
import { config } from '../config'

/**
 * Connects to a TypeORM connected database
 *
 * @param  {string} url the database connection url
 * @param  {boolean} drop if true, drops the schema eachtime a connection to the db is made
 * @returns {Promise<Connection>} the database connection object
 */
export async function setupConnection(url: string, drop: boolean = false): Promise<Connection> {
    return await createConnection({
        type: 'mongodb',
        url: url,
        entities: config.dbEntitiesPath,
        useNewUrlParser: true,
        synchronize: true,
        logging: false,
    });
}

/**
 * Class that works with redis
 *
 * @important **Declare it once**, only import from `server.ts`
 */
export class RedisConfiguration {
    client = new Redis({
        host: config.redis.host,
        port: config.redis.port
    });
    
    public async set(key: string, value: string, ttl: number = config.redis.ttl) {
        await this.client.set(key, value, 'EX', ttl);
    }
    
    public async get(key: string): Promise<string | null> {
        return this.client.get(key);
    }
    
    public getRedisClient() {
        return this.client;
    }
    
}