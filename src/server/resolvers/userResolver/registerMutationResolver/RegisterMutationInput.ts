import { InputType, Field } from 'type-graphql'
import { Length, IsEmail } from 'class-validator'

import { PasswordInputField } from '../inputFields/PasswordInputField.mixin'

import { IsEmailUniqueValidator } from './registerMutationInput/IsEmailUniqueValidator.decorator'

const RegisterMutationInputBase = PasswordInputField()

@InputType()
export class RegisterMutationInput extends RegisterMutationInputBase {
  @Field()
  @IsEmail()
  @IsEmailUniqueValidator({ message: 'Email $value is already in use' })
  public email: string

  @Field()
  @Length(1, 255)
  public username: string
}
