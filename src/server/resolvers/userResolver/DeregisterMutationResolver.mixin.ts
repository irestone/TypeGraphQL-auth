import { GraphQLScalarType, GraphQLBoolean } from 'graphql'
import { compareSync } from 'bcryptjs'
import {
  Resolver,
  Mutation,
  Arg,
  ClassType,
  Authorized,
  Ctx,
} from 'type-graphql'

import { User } from '../../entities'
import { sessionOptions } from '../../config'
import { ITypeGraphQLContext } from '../../interfaces'

import { DeregesterMutationInput } from './deregesterMutationResolver/DeregesterMutationInput'

export const DeregesterMutationResolverMixin = (
  BaseClass: ClassType = class {}
): ClassType => {
  @Resolver()
  class DeregesterMutationResolver extends BaseClass {
    @Authorized()
    @Mutation((): GraphQLScalarType => GraphQLBoolean)
    public async deregister(
      @Arg('input') { email, password }: DeregesterMutationInput,
      @Ctx() { req, res }: ITypeGraphQLContext
    ): Promise<boolean> {
      const user = await User.findOne({ email })
      if (!user || !compareSync(password, user.password))
        throw new Error('Wrong email/password')
      const { id: userId } = user
      await user.remove()
      return req.session!.userId !== userId
        ? true
        : new Promise(
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
  return DeregesterMutationResolver
}
