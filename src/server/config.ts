import { ConnectionOptions } from 'typeorm'
import { SessionOptions } from 'express-session'
import { RedisStoreOptions } from 'connect-redis'
import * as entities from './entities'
// import IORedis, { Redis } from 'ioredis'
import { Redis } from 'ioredis'
const IORedis = require('ioredis')

require('dotenv').config()

const { env: Env } = process

// ========================================
//  ENVIRONMENT
// ========================================

if (!Env.NODE_ENV) throw new Error('Environment has not been set.')
export const env: string = Env.NODE_ENV
export const inProduction: boolean = env === 'production'
export const inDevelopment: boolean = env === 'development'
export const inTest: boolean = env === 'test'

if (!Env.HOST) throw new Error('Host has not been set.')
export const host: string = Env.HOST

if (!Env.PORT) throw new Error('Port has not been set.')
export const port: number = parseInt(Env.PORT)

if (!Env.SALT) throw new Error('Salt has not been set.')
export const salt: number = parseInt(Env.SALT)

if (!Env.TOKEN_EXPTIME)
  throw new Error('Token expiration time has not been set.')
export const tokenExpirationTime = parseInt(Env.TOKEN_EXPTIME)

// ========================================
//  DATA
// ========================================

// ====={ Domain }

const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME, DB_TEST_NAME } = Env
if (!DB_HOST || !DB_PORT || !DB_USER || !DB_PASS || !DB_NAME || !DB_TEST_NAME)
  throw new Error('DB option(s) has not been set.')

export const ormConnectionOptions = (
  dropSchema: boolean = false
): ConnectionOptions => {
  if (dropSchema && !(inDevelopment || inTest))
    throw new Error('Trying to drop DB being not in dev or test environment.')
  return {
    type: 'postgres',
    host: DB_HOST,
    port: parseInt(DB_PORT),
    username: DB_USER,
    password: DB_PASS,
    database: inTest ? DB_TEST_NAME : DB_NAME,
    dropSchema,
    synchronize: dropSchema || inDevelopment,
    entities: Object.values(entities),
  }
}

// ====={ Session }

const { SESS_NAME, SESS_SECRET, SESS_LIFETIME } = Env
if (!SESS_NAME || !SESS_SECRET || !SESS_LIFETIME)
  throw new Error('Session option(s) has not been set.')

export const sessionOptions: SessionOptions = {
  name: SESS_NAME,
  secret: SESS_SECRET,
  saveUninitialized: false,
  resave: true,
  rolling: true,
  cookie: {
    sameSite: true,
    httpOnly: true,
    secure: inProduction,
    maxAge: parseInt(SESS_LIFETIME),
  },
}

const { REDIS_HOST, REDIS_PORT, REDIS_PASS } = Env
if (!REDIS_HOST || !REDIS_PORT || !REDIS_PASS)
  throw new Error('Redis option(s) has not been set.')

export const redisClient: Redis = new IORedis({
  host: REDIS_HOST,
  port: parseInt(REDIS_PORT),
  password: REDIS_PASS,
})

export const redisStoreOptions: RedisStoreOptions = {
  client: redisClient as any,
}
