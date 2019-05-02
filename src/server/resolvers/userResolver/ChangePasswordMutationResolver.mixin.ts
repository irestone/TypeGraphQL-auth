import { GraphQLScalarType, GraphQLBoolean } from 'graphql'
import { Resolver, Mutation, Arg, ClassType } from 'type-graphql'
import { hashSync } from 'bcryptjs'

import { User } from '../../entities'
import { redisClient, salt } from '../../config'
import { changePasswordPrefix } from '../../constants/tokenPrefixes'

import { ChangePasswordMutationInput } from './changePasswordMutationResolver/ChangePasswordMutationInput'

export const ChangePasswordMutationResolverMixin = (
  BaseClass: ClassType = class {}
): ClassType => {
  @Resolver()
  class ChangePasswordMutationResolver extends BaseClass {
    @Mutation((): GraphQLScalarType => GraphQLBoolean)
    public async changePassword(@Arg('input')
    {
      token,
      password,
    }: ChangePasswordMutationInput): Promise<boolean> {
      const redisKey = changePasswordPrefix + token
      const email = await redisClient.get(redisKey)
      if (!email) throw new Error('Bad token')
      const user = await User.findOne({ email })
      if (!user) throw new Error('User not found')
      user.password = hashSync(password, salt)
      await user.save()
      await redisClient.del(redisKey)
      return true
    }
  }
  return ChangePasswordMutationResolver
}
