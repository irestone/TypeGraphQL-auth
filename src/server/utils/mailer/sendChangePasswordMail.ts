import nodemailer from 'nodemailer'

import { userChangePasswordPath } from '../../paths'
import { changePasswordPrefix } from '../../constants/tokenPrefixes'
import { generateToken } from '../tokenGenerator'

export const sendChangePasswordMail = async (to: string): Promise<void> => {
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

  const token = await generateToken(changePasswordPrefix, to)
  const url = userChangePasswordPath(token)

  const info = await transporter.sendMail({
    from: 'TGQL-auth <foo@example.com>',
    to,
    subject: 'Changing a password',
    text: url,
    html: `<p>${url}</p>`,
  })

  console.log('Message sent: %s', info.messageId)
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
}
