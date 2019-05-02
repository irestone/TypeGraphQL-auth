import { InputType, Field } from 'type-graphql'
import { Length, IsEmail, MinLength } from 'class-validator'

import { IsEmailUnique } from './userInputTypes/IsEmailUnique'

const minPasswordLength = 3

// ====={ Register }

@InputType()
export class RegisterInput {
  @Field()
  @IsEmail()
  @IsEmailUnique({ message: 'Email $value is already in use' })
  public email: string

  @Field()
  @Length(1, 100)
  public username: string

  @Field()
  @MinLength(minPasswordLength)
  public password: string
}

// ====={ Login }

@InputType()
export class LoginInput {
  @Field()
  public username: string

  @Field()
  @MinLength(minPasswordLength)
  public password: string
}

// ====={ Change Password }

@InputType()
export class ChangePasswordInput {
  @Field()
  public token: string

  @Field()
  @MinLength(minPasswordLength)
  public newPassword: string
}
