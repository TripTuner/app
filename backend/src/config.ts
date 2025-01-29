import dotenv from "dotenv";
import { Config } from "./interfaces/config.interfaces";

dotenv.config({ path: '.env' })

// mongo
const databaseUrl = process.env.DATABASE_URL || 'mongodb://admin:adminadmin@localhost:27017/apidb'

// redis defaults
const redis = {
    host: 'localhost',
    port: 6379,
    ttl: 60 * 60 * 24
}

if (process.env.REDIS_URL) {
    const url = process.env.REDIS_URL
    
    redis.host = url.split(':')[0]
    redis.port = Number.parseInt(url.split(':').slice(1).join(''));
}

const config: Config = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: +(process.env.PORT || 3000),
    redis: redis,
    databaseUrl: databaseUrl,
    dbEntitiesPath: ['src/entities/**/*.entity.ts'],
    parsePlaceEntities: false,
    mosDataKey: "14c319dc-18f8-4b43-8ced-3d8284e7b255",
    timepadKey: String(process.env.TIMEPAD),
    parseEventsCount: 59,
    RouterKey: String(process.env.ROUTE_KEY),
}

if (process.env.PARSE_ENTITIES === "true") {
    config.parsePlaceEntities = true;
}

export { config }