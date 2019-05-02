import { Resolver, Mutation, Arg, ClassType, Ctx } from 'type-graphql'
import { compareSync } from 'bcryptjs'

import { User } from '../../entities'
import { ITypeGraphQLContext } from '../../interfaces'

import { LoginMutationInput } from './loginMutationResolver/LoginMutationInput'

export const LoginMutationResolverMixin = (
  BaseClass: ClassType = class {}
): ClassType => {
  @Resolver()
  class LoginMutationResolver extends BaseClass {
    @Mutation((): typeof User => User)
    public async login(
      @Arg('input') { email, password }: LoginMutationInput,
      @Ctx() { req }: ITypeGraphQLContext
    ): Promise<User> {
      const user = await User.findOne({ email })
      if (!user || !compareSync(password, user.password))
        throw new Error('Wrong email/password')
      if (!user.verified) throw new Error(`Not verified`)
      if (!req.session) throw new Error('Session not found')
      req.session.userId = user.id
      return user
    }
  }
  return LoginMutationResolver
}
