import { Resolver, ClassType, Authorized, Query } from 'type-graphql'

import { User } from '../../entities'

export const UsersQueryResolverMixin = (
  BaseClass: ClassType = class {}
): ClassType => {
  @Resolver()
  class UsersQueryResolver extends BaseClass {
    @Authorized()
    @Query((): (typeof User)[] => [User])
    public async users(): Promise<User[]> {
      const users = await User.find()
      return users
    }
  }
  return UsersQueryResolver
}
