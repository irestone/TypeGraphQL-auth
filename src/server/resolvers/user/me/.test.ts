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
{
  me {
    id
    email
    username
  }
}
`

// ========================================
//  TEST
// ========================================

describe('Me', (): void => {
  it('gets the user', async (): Promise<void> => {
    const user = User.create({
      email: faker.internet.email(),
      password: faker.internet.password(),
      username: faker.internet.userName(),
    })

    await user.save()

    const { errors, data } = await gqlCall({ source, userId: user.id })

    expect(errors).toBeUndefined()

    expect(data).toMatchObject({
      me: {
        id: user.id.toHexString(),
        email: user.email,
        username: user.username
      }
    })
  })

  it('throws an error, if user is not logged in', async (): Promise<void> => {
    const { errors } = await gqlCall({ source })
    expect(errors).toBeDefined()
  })
})
