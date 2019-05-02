import { InputType, Field } from 'type-graphql'

import { PasswordInputField } from '../inputFields/PasswordInputField.mixin'

const RegisterMutationInputBase = PasswordInputField()

@InputType()
export class ChangePasswordMutationInput extends RegisterMutationInputBase {
  @Field()
  public token: string
}
