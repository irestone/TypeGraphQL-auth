import { graphql, ExecutionResult, GraphQLArgs, GraphQLSchema } from 'graphql'

import { buildSchema } from '../buildSchema'

interface Options {
  source: GraphQLArgs['source']
  variableValues?: GraphQLArgs['variableValues']
}

let schema: GraphQLSchema

export const gqlCall = async ({
  source,
  variableValues,
}: Options): Promise<ExecutionResult> => {
  if (!schema) schema = buildSchema()
  return graphql({
    schema,
    source,
    variableValues,
  })
}
