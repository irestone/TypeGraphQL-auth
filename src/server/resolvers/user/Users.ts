import { Resolver, Authorized, Query } from 'type-graphql'

import { User } from '../../entities'

@Resolver()
export class Users {
  @Authorized()
  @Query((): (typeof User)[] => [User])
  public async users(): Promise<User[]> {
    const users = await User.find()
    return users
  }
}
