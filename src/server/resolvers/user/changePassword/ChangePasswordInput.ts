import { InputType, Field } from 'type-graphql'

import { PasswordInputField } from '../inputFields/PasswordInputField.mixin'

const ChangePasswordInputBase = PasswordInputField()

@InputType()
export class ChangePasswordInput extends ChangePasswordInputBase {
  @Field()
  public token: string
}
