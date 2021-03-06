import 'reflect-metadata'
import express, { Application } from 'express'
import { ApolloServer } from 'apollo-server-express'
import { createConnection, Connection } from 'typeorm'
import expressSession from 'express-session'
import connectRedis, { RedisStore as IRedisStore } from 'connect-redis'
import queryComplexity, {
  fieldConfigEstimator,
  simpleEstimator,
} from 'graphql-query-complexity'

import { IServerInfo } from './interfaces'
import { buildSchema } from './utils/buildSchema'
import {
  port,
  host,
  inProduction,
  ormConnectionOptions,
  sessionOptions,
  redisStoreOptions,
  maxQC,
} from './config'

class Server {
  private static app: Application
  private static links: { [name: string]: string } = {}

  public static async launch(): Promise<IServerInfo> {
    await Server.connectToDB()
    await Server.createApp()
    await Server.createSessionStore()
    await Server.createApolloServer()
    await Server.startListening()
    return Server.createInfo()
  }

  private static async connectToDB(): Promise<void> {
    const connection: Connection = await createConnection(
      ormConnectionOptions()
    )
    if (!connection.isConnected) throw new Error('DB connection failed')
  }

  private static async createApp(): Promise<void> {
    Server.app = express()
  }

  private static async createSessionStore(): Promise<void> {
    const RedisStore: IRedisStore = connectRedis(expressSession)
    sessionOptions.store = new RedisStore(redisStoreOptions)
    Server.app.use(expressSession(sessionOptions))
  }

  private static async createApolloServer(): Promise<void> {
    const apollo = new ApolloServer({
      schema: buildSchema(),
      context: ({ req, res }): object => ({ req, res }),
      playground: !inProduction && {
        settings: { 'request.credentials': 'include' } as any,
      },
      validationRules: [
        queryComplexity({
          maximumComplexity: maxQC,
          variables: {},
          onComplete: (complexity: number): void => {
            console.log('Query Complexity:', complexity)
          },
          estimators: [
            fieldConfigEstimator(),
            simpleEstimator({ defaultComplexity: 1 }),
          ],
        }) as any,
      ],
    })
    apollo.applyMiddleware({ app: Server.app, cors: false })
    Server.links.GraphQL = `http://${host}:${port}${apollo.graphqlPath}`
  }

  private static async startListening(): Promise<void> {
    await new Promise(
      (resolve): void => {
        Server.app.listen(
          port,
          (): void => {
            resolve()
            Server.links.App = `http://${host}:${port}`
          }
        )
      }
    )
  }

  private static createInfo(): IServerInfo {
    const links = Object.entries(Server.links)
      .map(([name, url]): string => `${name}: ${url}`)
      .join(`\n`)

    return { links }
  }
}

Server.launch()
  .then(({ links }: IServerInfo): void => console.log(links))
  .catch((err: Error): void => console.error(err))
