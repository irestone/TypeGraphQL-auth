import { host, port } from './config'

const base = `http://${host}:${port}`
const user = `${base}/user`

export const userVerificationPath = (token: string): string =>
  `${user}/verify/${token}`

export const userChangePasswordPath = (token: string): string =>
  `${user}/change-password/${token}`
