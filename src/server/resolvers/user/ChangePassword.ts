import { GraphQLScalarType, GraphQLBoolean } from 'graphql'
import { Resolver, Mutation, Arg } from 'type-graphql'
import { hashSync } from 'bcryptjs'

import { User } from '../../entities'
import { redisClient, salt } from '../../config'
import { changePasswordPrefix } from '../../constants/tokenPrefixes'

import { ChangePasswordInput } from './changePassword/Input'

@Resolver()
export class ChangePassword {
  @Mutation((): GraphQLScalarType => GraphQLBoolean)
  public async changePassword(@Arg('input')
  {
    token,
    password,
  }: ChangePasswordInput): Promise<boolean> {
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
