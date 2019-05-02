import { GraphQLScalarType, GraphQLBoolean } from 'graphql'
import { Resolver, Mutation, Arg, ClassType } from 'type-graphql'

import { User } from '../../entities'
import { verifyUserPrefix } from '../../constants/tokenPrefixes'
import { redisClient } from '../../config'

export const VerifyMutationResolverMixin = (
  BaseClass: ClassType = class {}
): ClassType => {
  @Resolver()
  class VerifyMutationResolver extends BaseClass {
    @Mutation((): GraphQLScalarType => GraphQLBoolean)
    public async verify(@Arg('token') token: string): Promise<boolean> {
      const redisKey = verifyUserPrefix + token
      const email = await redisClient.get(redisKey)
      if (!email) throw new Error('Bad token')
      const user = await User.findOne({ email })
      if (!user) throw new Error('User not found')
      user.verified = true
      await user.save()
      await redisClient.del(redisKey)
      return true
    }
  }
  return VerifyMutationResolver
}
