import { InputType, Field } from 'type-graphql'

@InputType()
export class DeregesterInput {
  @Field()
  public email: string

  @Field()
  public password: string
}
