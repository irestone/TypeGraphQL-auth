import { Resolver, Ctx, Authorized, Query } from 'type-graphql'
import { ObjectId } from 'mongodb'

import { User } from '../../entities'
import { IGQLContext } from '../../interfaces'

@Resolver()
export class Me {
  @Authorized()
  @Query((): typeof User => User)
  public async me(@Ctx() { req }: IGQLContext): Promise<User> {
    const user = await User.findOne({
      where: { _id: new ObjectId(req.session!.userId) },
    })
    if (!user) throw Error('User not found.')
    return user
  }
}
