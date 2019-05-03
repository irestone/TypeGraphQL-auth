import { Resolver, Mutation, Arg, Ctx } from 'type-graphql'
import { compareSync } from 'bcryptjs'

import { User } from '../../entities'
import { IGQLContext } from '../../interfaces'

import { LoginInput } from './login/LoginInput'

// todo @Authorized('GUEST')

@Resolver()
export class Login {
  @Mutation((): typeof User => User)
  public async login(
    @Arg('input') { email, password }: LoginInput,
    @Ctx() { req }: IGQLContext
  ): Promise<User> {
    if (!req.session) throw new Error('Session not found')
    if (req.session.userId) throw new Error('Already logged in')
    const user = await User.findOne({ email })
    if (!user || !compareSync(password, user.password))
      throw new Error('Wrong email/password')
    if (!user.verified) throw new Error(`Not verified`)
    req.session.userId = user.id
    return user
  }
}
