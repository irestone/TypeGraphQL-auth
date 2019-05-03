import { GraphQLScalarType, GraphQLBoolean } from 'graphql'
import { Resolver, Mutation, Arg } from 'type-graphql'

import { User } from '../../entities'
import { sendChangePasswordMail } from '../../utils/mail/changePassword'

@Resolver()
export class ForgetPassword {
  @Mutation((): GraphQLScalarType => GraphQLBoolean)
  public async forgetPassword(@Arg('email') email: string): Promise<boolean> {
    const user = await User.findOne({ email })
    if (!user) throw new Error('User not found')
    await sendChangePasswordMail(email)
    return true
  }
}
