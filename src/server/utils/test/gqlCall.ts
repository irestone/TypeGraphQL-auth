import { graphql, ExecutionResult, GraphQLArgs } from 'graphql'

import { buildSchema } from '../buildSchema'

interface Options {
  source: GraphQLArgs['source']
  variableValues?: GraphQLArgs['variableValues']
}

export const gqlCall = async ({
  source,
  variableValues,
}: Options): Promise<ExecutionResult> =>
  graphql({
    schema: buildSchema(),
    source,
    variableValues,
  })
