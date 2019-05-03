import { InputType, Field } from 'type-graphql'
import { Length, IsEmail } from 'class-validator'

import { PasswordInputField } from '../inputFields/PasswordInputField.mixin'

import { IsEmailUnique } from './registerInput/IsEmailUnique.decorator'

const RegisterInputBase = PasswordInputField()

@InputType()
export class RegisterInput extends RegisterInputBase {
  @Field()
  @IsEmail()
  @IsEmailUnique({ message: 'Email $value is already in use' })
  public email: string

  @Field()
  @Length(1, 255)
  public username: string
}
