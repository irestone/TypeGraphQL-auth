import { buildSchemaSync } from 'type-graphql'
import { GraphQLSchema } from 'graphql'

import * as resolvers from '../resolvers'
import { authChecker } from '../auth/authChecker'

export const buildSchema = (): GraphQLSchema =>
  buildSchemaSync({
    resolvers: Object.values(resolvers),
    authChecker,
  })
