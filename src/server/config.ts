import { ConnectionOptions } from 'typeorm'

import * as types from './types'

const {
  NODE_ENV = 'development',
  HOST = 'localhost',
  PORT = '8080',
  TYPEORM_HOST = 'localhost',
  TYPEORM_PORT = '5432',
  TYPEORM_USERNAME = 'postgres',
  TYPEORM_PASSWORD = 'postgres',
  TYPEORM_DATABASE = 'playground',
  SALT = '12',
} = process.env

// /////////////////////////////////////////////////////////////////////////////
// ENVIRONMENT

export const env: string = NODE_ENV

export const host: string = HOST
export const port: number = parseInt(PORT)

export const salt: number = parseInt(SALT)

// /////////////////////////////////////////////////////////////////////////////
// DB CONNECTIONS

export const typeorm: ConnectionOptions = {
  type: 'postgres',
  host: TYPEORM_HOST,
  port: parseInt(TYPEORM_PORT),
  username: TYPEORM_USERNAME,
  password: TYPEORM_PASSWORD,
  database: TYPEORM_DATABASE,
  synchronize: true,
  logging: false,
  entities: Object.values(types),
}
