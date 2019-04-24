import 'reflect-metadata'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { createConnection, Connection } from 'typeorm'

import { port, host, typeorm } from './config'
import * as resolvers from './resolvers'

class Server {
  public static async bootstrap(): Promise<string> {
    const connection: Connection = await createConnection(typeorm)
    console.log(
      `\n${
        connection.isConnected
          ? 'Connected to PostgreSQL'
          : 'Connection to PostgreSQL failed'
      }`
    )

    const schema = await buildSchema({
      resolvers: Object.values(resolvers),
    })

    const apollo = new ApolloServer({ schema })

    const app = express()

    apollo.applyMiddleware({ app })

    // app.use((req: object, res: object): void => res.send(new Date()))

    await new Promise(
      (resolve): void => {
        app.listen(port, (): void => resolve())
      }
    )

    const links: [string, string][] = [
      ['Server', `http://${host}:${port}`],
      ['GraphQL', `http://${host}:${port}${apollo.graphqlPath}`],
    ]

    return links.map(([name, url]): string => `${name}: ${url}`).join(`\n`)
  }
}

Server.bootstrap()
  .then((message: string): void => console.log(message))
  .catch((err: object): void => console.error(err))
