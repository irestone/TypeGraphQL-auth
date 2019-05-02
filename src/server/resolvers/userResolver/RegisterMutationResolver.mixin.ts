import { Resolver, Mutation, Arg, Ctx, ClassType } from 'type-graphql'
import { hashSync } from 'bcryptjs'

import { User } from '../../entities'
import { ITypeGraphQLContext } from '../../interfaces'
import { salt } from '../../config'
import { sendVerificationMail } from '../../utils/mailer'

import { RegisterMutationInput } from './registerMutationResolver/RegisterMutationInput'

export const RegisterMutationResolverMixin = (
  BaseClass: ClassType = class {}
): ClassType => {
  @Resolver()
  class RegisterMutationResolver extends BaseClass {
    @Mutation((): typeof User => User)
    public async register(
      @Arg('input')
      { email, password, username }: RegisterMutationInput,
      @Ctx() { req }: ITypeGraphQLContext
    ): Promise<User> {
      const hashedPassword = await hashSync(password, salt)

      const user = await User.create({
        email,
        password: hashedPassword,
        username,
      }).save()

      await sendVerificationMail(email)

      if (!req.session) throw Error('Session not found')
      req.session.userId = user.id

      return user
    }
  }
  return RegisterMutationResolver
}
