import { Resolver, Ctx, ClassType, Authorized, Query } from 'type-graphql'

import { User } from '../../entities'
import { ITypeGraphQLContext } from '../../interfaces'

export const MeQueryResolverMixin = (
  BaseClass: ClassType = class {}
): ClassType => {
  @Resolver()
  class MeQueryResolver extends BaseClass {
    @Authorized()
    @Query((): typeof User => User)
    public async me(@Ctx() { req }: ITypeGraphQLContext): Promise<User> {
      const user = await User.findOne({ id: req.session!.userId })
      if (!user) throw Error('User not found.')
      return user
    }
  }
  return MeQueryResolver
}
