import { Connection } from 'typeorm'

import { connectdb } from '../../../utils/test/dbconnection'
import { gqlCall } from '../../../utils/test/gqlCall'

// ========================================
//  SETUP
// ========================================

// ====={ Creating DB Connection }

let connection: Connection

beforeAll(async (): Promise<void> => {
  connection = await connectdb()
})

afterAll(async (): Promise<void> => {
  await connection.close()
})

// ====={ Prepearing call options }

const source = `
mutation Register($input: RegisterInput!) {
  register(
    input: $input
  ) {
    id
    email
    username
  }
}
`

const variableValues = {
  input: {
    email: 'test@email.com',
    password: 'test',
    username: 'test'
  }
}



// ========================================
//  TEST
// ========================================

describe('Register', (): void => {
  it('creates user', async (): Promise<void> => {
    const { errors } = await gqlCall({ source, variableValues })
    if (errors) errors.forEach(err => { throw err })
  })
})
