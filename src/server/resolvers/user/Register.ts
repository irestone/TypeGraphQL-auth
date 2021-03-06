import { Resolver, Mutation, Arg } from 'type-graphql'
import { hashSync } from 'bcryptjs'

import { User } from '../../entities'
// import { IGQLContext } from '../../interfaces'
import { salt } from '../../config'
import { sendVerificationMail } from '../../utils/mail/verify'

import { RegisterInput } from './register/Input'

// todo @Authorized('GUEST')

@Resolver()
export class Register {
  @Mutation((): typeof User => User)
  public async register(@Arg('input')
  {
    email,
    password,
    username,
  }: RegisterInput): // @Ctx() ctx: IGQLContext
  Promise<User> {
    const hashedPassword = hashSync(password, salt)
    const user = await User.create({
      email,
      password: hashedPassword,
      username,
    })
    await user.save()
    await sendVerificationMail(email)
    // if (!ctx) throw new Error('Context not provided')
    // const { req } = ctx
    // if (!req.session) throw Error('Session not found')
    // req.session.userId = user.id
    return user
  }
}
