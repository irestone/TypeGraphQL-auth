import { Resolver, Mutation, Ctx, Authorized } from 'type-graphql'
import { GraphQLScalarType, GraphQLBoolean } from 'graphql'

import { IGQLContext } from '../../interfaces'
import { sessionOptions } from '../../config'

@Resolver()
export class Logout {
  @Authorized()
  @Mutation((): GraphQLScalarType => GraphQLBoolean)
  public async logout(@Ctx() { req, res }: IGQLContext): Promise<boolean> {
    return new Promise(
      (resolve, reject): void => {
        req.session!.destroy(
          (err): void => {
            if (err) return reject(err)
            if (!sessionOptions.name)
              return reject(new Error('Session name not found'))
            res.clearCookie(sessionOptions.name)
            resolve(true)
          }
        )
      }
    )
  }
}
