import { InputType, Field, ClassType } from 'type-graphql'
import { Length } from 'class-validator'

// Constraints
const min = 3
const max = 255

export const PasswordInputField = (
  BaseClass: ClassType = class {}
): ClassType => {
  @InputType({ isAbstract: true })
  class PasswordInputField extends BaseClass {
    @Field()
    @Length(min, max)
    public password: string
  }
  return PasswordInputField
}
