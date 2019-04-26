import { Resolver, Query, Mutation, Arg, Ctx, Authorized } from 'type-graphql'
import { compareSync, hashSync } from 'bcryptjs'
import { UserInputError } from 'apollo-server-express'
import { Request, Response } from 'express'
import { GraphQLBoolean, GraphQLScalarType } from 'graphql'

import { salt, sessionOptions } from '../config'
import { User } from '../entities'
import { RegisterInput } from './userResolver/RegisterInput'
import { LoginInput } from './userResolver/LoginInput'

// todo move it common
// ? why is it getting error when importing?
interface ITypeGraphQLContext {
  req: Request
  res: Response
}

@Resolver(User)
export class UserResolver {
  // ========================================
  //  QUERIES
  // ========================================

  // ====={ Me }

  @Authorized()
  @Query((): typeof User => User)
  public async me(@Ctx() { req }: ITypeGraphQLContext): Promise<User | null> {
    if (!req.session || !req.session.userId) {
      throw Error('Request session not found.')
    }
    const user = await User.findOne({ id: req.session.userId })
    if (!user) throw Error('User not found.')
    return user
  }

  // ====={ Users }

  @Authorized()
  @Query((): (typeof User)[] => [User])
  public async users(): Promise<User[]> {
    const users = await User.find()
    return users
  }

  // ========================================
  //  MUTATIONS
  // ========================================

  // ====={ Register }

  @Mutation((): typeof User => User)
  public async register(
    @Arg('input')
    { email, username, password }: RegisterInput,
    @Ctx() { req }: ITypeGraphQLContext
  ): Promise<User> {
    const hashedPassword = await hashSync(password, salt)

    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    }).save()

    if (!req.session) throw Error('Request session has not been created.')
    req.session.userId = user.id

    return user
  }

  // ====={ Deregister }

  @Authorized()
  @Mutation((): GraphQLScalarType => GraphQLBoolean)
  public async deregister(
    @Arg('input') { username, password }: LoginInput,
    @Ctx() { req, res }: ITypeGraphQLContext
  ): Promise<boolean> {
    // Romove user from DB
    const user = await User.findOne({ username })
    if (!user || !compareSync(password, user.password)) {
      throw new UserInputError('Invalid username and password pair')
    }
    const { id } = user
    await user.remove()
    // Delete session
    if (req.session && req.session.userId === id) {
      await new Promise(
        (resolve, reject): void => {
          const { name } = sessionOptions
          if (!req.session || !name) {
            reject(new Error('Session not found'))
          } else {
            req.session.destroy(
              (err): void => {
                if (err) reject(err)
                res.clearCookie(name)
                resolve(true)
              }
            )
          }
        }
      )
    }
    return true
  }

  // ====={ Login }

  @Mutation((): typeof User => User, { nullable: true })
  public async login(
    @Arg('input') { username, password }: LoginInput,
    @Ctx() { req }: ITypeGraphQLContext
  ): Promise<User> {
    const user = await User.findOne({ username })
    if (!user || !compareSync(password, user.password)) {
      throw new UserInputError('Invalid username and password pair')
    }
    if (!req.session) throw Error('Request session has not been created.')
    req.session.userId = user.id
    return user
  }

  // ====={ Logout }

  @Authorized()
  @Mutation((): GraphQLScalarType => GraphQLBoolean)
  public async logout(@Ctx() { req, res }: ITypeGraphQLContext): Promise<
    boolean
  > {
    return new Promise(
      (resolve, reject): void => {
        const { name } = sessionOptions
        if (!req.session || !name) {
          reject(new Error('Session not found'))
        } else {
          req.session.destroy(
            (err): void => {
              if (err) reject(err)
              res.clearCookie(name)
              resolve(true)
            }
          )
        }
      }
    )
  }
}
