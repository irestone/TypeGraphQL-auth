import { v4 as uuidV4 } from 'uuid'
import { redisClient } from '../../../config'

export const generateVerificationToken = async (
  email: string
): Promise<string> => {
  const token = uuidV4()
  await redisClient.set(token, email, 'ex', 86400)
  return token
}
