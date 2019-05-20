import { graphql, ExecutionResult, GraphQLArgs, GraphQLSchema } from 'graphql'
import { ObjectID } from 'typeorm'

import { buildSchema } from '../buildSchema'

interface Options {
  source: GraphQLArgs['source']
  variableValues?: GraphQLArgs['variableValues']
  userId?: ObjectID
}

let schema: GraphQLSchema

export const gqlCall = async ({
  source,
  variableValues,
  userId,
}: Options): Promise<ExecutionResult> => {
  if (!schema) schema = buildSchema()
  return graphql({
    schema,
    source,
    variableValues,
    contextValue: {
      req: {
        session: {
          userId,
        },
      },
      res: {},
    },
  })
}
