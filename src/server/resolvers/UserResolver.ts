import { Resolver, Query, Mutation, Arg } from 'type-graphql'
import { hash } from 'bcryptjs'
import { salt } from '../config'
import { User } from '../models'

@Resolver(User)
export class UserResolver {
  @Query((): (typeof User)[] => [User])
  public async users(): Promise<User[]> {
    const users = await User.find()
    return users
  }

  @Mutation((): typeof User => User)
  public async register(
    @Arg('email') email: string,
    @Arg('username') username: string,
    @Arg('password') password: string
  ): Promise<User> {
    const hashedPassword = await hash(password, salt)

    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    }).save()

    return user
  }
}
