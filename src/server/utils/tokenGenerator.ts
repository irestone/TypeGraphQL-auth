import { v4 as uuidV4 } from 'uuid'

import { redisClient, tokenExpirationTime } from '../config'

export const generateToken = async (
  prefix: string,
  value: string,
  ex: number = tokenExpirationTime
): Promise<string> => {
  const token = uuidV4()
  await redisClient.set(prefix + token, value, 'ex', ex)
  return token
}
