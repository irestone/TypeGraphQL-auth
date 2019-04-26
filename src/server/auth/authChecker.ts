import { AuthChecker } from 'type-graphql'
import { Request, Response } from 'express'

interface ITypeGraphQLContext {
  req: Request
  res: Response
}

export const authChecker: AuthChecker<ITypeGraphQLContext> = ({
  context: { req },
}): boolean => !!req.session && !!req.session.userId
