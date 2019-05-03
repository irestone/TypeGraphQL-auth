import { Resolver, Mutation, Arg, Ctx } from 'type-graphql'
import { hashSync } from 'bcryptjs'

import { User } from '../../entities'
import { IGQLContext } from '../../interfaces'
import { salt } from '../../config'
import { sendVerificationMail } from '../../utils/mail/verify'

import { RegisterInput } from './register/RegisterInput'

// todo @Authorized('GUEST')

@Resolver()
export class Register {
  @Mutation((): typeof User => User)
  public async register(
    @Arg('input')
    { email, password, username }: RegisterInput,
    @Ctx() { req }: IGQLContext
  ): Promise<User> {
    const hashedPassword = await hashSync(password, salt)
    const user = await User.create({
      email,
      password: hashedPassword,
      username,
    })
    await user.save()
    await sendVerificationMail(email)
    if (!req.session) throw Error('Session not found')
    req.session.userId = user.id
    return user
  }
}
