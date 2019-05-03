import nodemailer from 'nodemailer'

import { userVerificationPath } from '../../paths'
import { verifyUserPrefix } from '../../constants/tokenPrefixes'
import { generateToken } from '../tokenGenerator'

export const sendVerificationMail = async (to: string): Promise<void> => {
  const account = await nodemailer.createTestAccount()

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: account.user,
      pass: account.pass,
    },
  })

  const token = await generateToken(verifyUserPrefix, to)
  const url = userVerificationPath(token)

  const info = await transporter.sendMail({
    from: 'TGQL-auth <foo@example.com>',
    to,
    subject: 'Email verification',
    text: url,
    html: `<p>${url}</p>`,
  })

  console.log('Message sent: %s', info.messageId)
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
}
