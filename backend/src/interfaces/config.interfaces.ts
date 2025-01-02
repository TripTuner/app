interface RedisConnDetails {
    host: string
    port: number
    ttl: number
}

export interface Config {
    nodeEnv: string
    port: number
    redis: RedisConnDetails
    databaseUrl: string
    dbEntitiesPath: string[]
    parsePlaceEntities: boolean
    mosDataKey: string
    timepadKey: string
    parseEventsCount: number
}