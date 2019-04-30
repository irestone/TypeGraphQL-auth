import nodemailer from 'nodemailer'

import { host, port } from '../../config'

import { generateVerificationToken } from './sendVerificationMail/generateVerificationToken'

export const sendVerificationMail = async (to: string): Promise<void> => {
  const token = await generateVerificationToken(to)
  const verificatinURL = `http://${host}:${port}/user/verify/${token}`

  const testAccount = await nodemailer.createTestAccount()

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  })

  const info = await transporter.sendMail({
    from: 'TGQL-auth <foo@example.com>',
    to,
    subject: 'Email verification',
    text: `<a href="${verificatinURL}">Click on the link</a>`,
    html: `<p><a href="${verificatinURL}">Click on this link to verify your email</a></p><p>Token: ${token}</p>`,
  })

  console.log('Message sent: %s', info.messageId)
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
}
