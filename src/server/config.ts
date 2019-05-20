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
export const tokenExpirationTime: number = parseInt(Env.TOKEN_EXPTIME)

if (!Env.MAX_QUERY_COMPLEXITY)
  throw new Error('Maximum query complexity has not been set.')
export const maxQC: number = parseInt(Env.MAX_QUERY_COMPLEXITY)

// ========================================
//  DOMAIN DATABASE
// ========================================

interface IDBCredentials {
  host: string
  port: number
  database: string
  username: string
  password: string
}

let dbCredentials: IDBCredentials

switch (env) {
  case 'development':
    const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS } = Env
    if (!DB_HOST || !DB_PORT || !DB_NAME || !DB_USER || !DB_PASS)
      throw new Error('DB credentials has not been set.')
    dbCredentials = {
      host: DB_HOST,
      port: parseInt(DB_PORT),
      database: DB_NAME,
      username: DB_USER,
      password: DB_PASS,
    }
    break
  case 'test':
    const {
      DB_TEST_HOST,
      DB_TEST_PORT,
      DB_TEST_NAME,
      DB_TEST_USER,
      DB_TEST_PASS,
    } = Env
    if (
      !DB_TEST_HOST ||
      !DB_TEST_PORT ||
      !DB_TEST_NAME ||
      !DB_TEST_USER ||
      !DB_TEST_PASS
    )
      throw new Error('Test DB credentials has not been set.')
    dbCredentials = {
      host: DB_TEST_HOST,
      port: parseInt(DB_TEST_PORT),
      database: DB_TEST_NAME,
      username: DB_TEST_USER,
      password: DB_TEST_PASS,
    }
    break
  default:
    throw new Error('Unknown environment for DB')
}

export const ormConnectionOptions = (
  dropSchema: boolean = false
): ConnectionOptions => {
  if (dropSchema && !(inDevelopment || inTest))
    throw new Error('Droping DB tables being not in dev or test environment.')
  return {
    ...dbCredentials,
    type: 'mongodb',
    dropSchema,
    synchronize: dropSchema || inDevelopment,
    entities: Object.values(entities),
  }
}

// ========================================
//  SESSION DATABASE
// ========================================

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
