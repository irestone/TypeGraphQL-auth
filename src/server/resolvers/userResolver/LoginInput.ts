import { InputType, Field } from 'type-graphql'

@InputType()
export class LoginInput {
  @Field()
  public username: string

  @Field()
  public password: string
}
