import { createConnection, Connection } from 'typeorm'

import { ormConnectionOptions, inTest } from '../../config'

if (!inTest) throw new Error('Environment for tests has not been set')

export const initdb = (): Promise<Connection> =>
  createConnection(ormConnectionOptions(true))

export const connectdb = (): Promise<Connection> =>
  createConnection(ormConnectionOptions())
