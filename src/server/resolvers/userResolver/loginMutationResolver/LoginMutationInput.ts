import { InputType, Field } from 'type-graphql'

@InputType()
export class LoginMutationInput {
  @Field()
  public email: string

  @Field()
  public password: string
}
