import { Connection } from 'typeorm'

import { connectdb } from '../../../utils/test/dbconnection'
import { gqlCall } from '../../../utils/test/gqlCall'
import { User } from '../../../entities'

const faker = require('faker')

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
    email: faker.internet.email(),
    password: faker.internet.password(),
    username: faker.internet.userName(),
  }
}



// ========================================
//  TEST
// ========================================

describe('Register', (): void => {
  it('creates a user', async (): Promise<void> => {
    const { errors, data } = await gqlCall({ source, variableValues })

    expect(errors).toBeUndefined()

    expect(data).toMatchObject({
      register: {
        email: variableValues.input.email,
        username: variableValues.input.username
      }
    })

    const dbUser = await User.findOne({ email: variableValues.input.email })

    expect(dbUser).toBeDefined()
    expect(dbUser!.email).toBe(variableValues.input.email)
    expect(dbUser!.verified).toBeFalsy()
  })
})
