import { InputType, Field } from 'type-graphql'

import { PasswordInputField } from '../inputFields/Password'

const Base = PasswordInputField()

@InputType()
export class ChangePasswordInput extends Base {
  @Field()
  public token: string
}
