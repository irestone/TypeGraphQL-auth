import { GraphQLScalarType, GraphQLBoolean } from 'graphql'
import { compareSync } from 'bcryptjs'
import { Resolver, Mutation, Arg, Authorized, Ctx } from 'type-graphql'

import { User } from '../../entities'
import { sessionOptions } from '../../config'
import { IGQLContext } from '../../interfaces'

import { DeregesterInput } from './deregester/DeregesterInput'

@Resolver()
export class Deregester {
  @Authorized()
  @Mutation((): GraphQLScalarType => GraphQLBoolean)
  public async deregister(
    @Arg('input') { email, password }: DeregesterInput,
    @Ctx() { req, res }: IGQLContext
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
