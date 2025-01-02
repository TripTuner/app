import dotenv from 'dotenv'
import { Config } from './interfaces/config.interfaces'

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
    mosDataKey: String(process.env.MOS_DATA_KEY),
    timepadKey: String(process.env.TIMEPAD),
    parseEventsCount: 59
}

if (Boolean(process.env.PARSE_ENTITIES)) {
    config.parsePlaceEntities = true;
}

export { config }