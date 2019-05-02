import { InputType, Field } from 'type-graphql'
import { Length, IsEmail } from 'class-validator'

import { IsEmailUnique } from './userInputTypes/IsEmailUnique'
import { PasswordInputFieldMixin } from './fields/PasswordInputField.mixin'

// ====={ Register }

@InputType()
export class RegisterInput extends PasswordInputFieldMixin() {
  @Field()
  @IsEmail()
  @IsEmailUnique({ message: 'Email $value is already in use' })
  public email: string

  @Field()
  @Length(1, 100)
  public username: string
}

// ====={ Login }

@InputType()
export class LoginInput {
  @Field()
  public username: string

  @Field()
  public password: string
}

// ====={ Change Password }

@InputType()
export class ChangePasswordInput extends PasswordInputFieldMixin() {
  @Field()
  public token: string
}
