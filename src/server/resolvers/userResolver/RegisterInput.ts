import { InputType, Field } from 'type-graphql'
import { Length, IsEmail } from 'class-validator'

import { IsEmailUnique } from './registerInput/IsEmailUnique'

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
  public password: string
}
