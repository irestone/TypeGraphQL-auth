import { Resolver, Mutation, ClassType, Ctx, Authorized } from 'type-graphql'
import { GraphQLScalarType, GraphQLBoolean } from 'graphql'

import { ITypeGraphQLContext } from '../../interfaces'
import { sessionOptions } from '../../config'

export const LogoutMutationResolverMixin = (
  BaseClass: ClassType = class {}
): ClassType => {
  @Resolver()
  class LogoutMutationResolver extends BaseClass {
    @Authorized()
    @Mutation((): GraphQLScalarType => GraphQLBoolean)
    public async logout(@Ctx() { req, res }: ITypeGraphQLContext): Promise<
      boolean
    > {
      return new Promise(
        (resolve, reject): void => {
          if (!req.session || !sessionOptions.name)
            return reject(new Error('Session not found'))
          req.session.destroy(
            (err): void => {
              if (err) return reject(err)
              res.clearCookie(sessionOptions.name as string)
              resolve(true)
            }
          )
        }
      )
    }
  }
  return LogoutMutationResolver
}
