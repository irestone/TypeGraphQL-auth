import { InputType, Field } from 'type-graphql'
import { Length, IsEmail } from 'class-validator'

import { PasswordInputField } from '../inputFields/Password'

import { IsEmailUnique } from './input/IsEmailUnique'

const Base = PasswordInputField()

@InputType()
export class RegisterInput extends Base {
  @Field()
  @IsEmail()
  @IsEmailUnique({ message: 'Email $value is already in use' })
  public email: string

  @Field()
  @Length(1, 255)
  public username: string
}
