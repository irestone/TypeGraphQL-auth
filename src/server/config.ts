import { ConnectionOptions } from 'typeorm'
import { SessionOptions } from 'express-session'
import { RedisStoreOptions } from 'connect-redis'

import * as entities from './entities'

const {
  HOST = 'localhost',
  NODE_ENV = 'development',
  ORM_DATABASE = 'playground',
  ORM_HOST = 'localhost',
  ORM_PASSWORD = 'postgres',
  ORM_PORT = '5432',
  ORM_USERNAME = 'postgres',
  PORT = '8080',
  REDIS_HOST,
  REDIS_PASS,
  REDIS_PORT,
  SALT = '12',
  SESS_LIFETIME = '3600000',
  SESS_NAME = 'sid',
  SESS_SECRET = 'secret',
} = process.env

// /////////////////////////////////////////////////////////////////////////////
// ENVIRONMENT

export const env: string = NODE_ENV
export const inProduction: boolean = env === 'production'

export const host: string = HOST
export const port: number = parseInt(PORT)

export const salt: number = parseInt(SALT)

// /////////////////////////////////////////////////////////////////////////////
// DATA STORAGE

// DOMAIN

// Postgress ORM
export const ormConnectionOptions: ConnectionOptions = {
  type: 'postgres',
  host: ORM_HOST,
  port: parseInt(ORM_PORT),
  username: ORM_USERNAME,
  password: ORM_PASSWORD,
  database: ORM_DATABASE,
  synchronize: true,
  logging: false,
  entities: Object.values(entities),
}

// SESSION

// Sessions and cookies
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

// Redis session store
export const redisStoreOptions: RedisStoreOptions = {
  host: REDIS_HOST,
  port: (REDIS_PORT && parseInt(REDIS_PORT)) || undefined,
  pass: REDIS_PASS,
}
