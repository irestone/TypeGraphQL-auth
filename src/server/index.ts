import 'reflect-metadata'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema, Resolver, Query } from 'type-graphql'

import { port, host } from './config'

@Resolver()
class HelloResolver {
  @Query((): StringConstructor => String)
  public hello(): string {
    return 'hello world!'
  }
}

class Server {
  public static async start(): Promise<string> {
    const schema = await buildSchema({
      resolvers: [HelloResolver],
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

    return `
      Server  ${host}:${port}
      GraphQL ${host}:${port}${apollo.graphqlPath}
    `
  }
}

Server.start()
  .then((message: string): void => console.log(message))
  .catch((err: object): void => console.error(err))
