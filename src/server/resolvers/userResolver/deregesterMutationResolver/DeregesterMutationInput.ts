import { InputType, Field } from 'type-graphql'

@InputType()
export class DeregesterMutationInput {
  @Field()
  public email: string

  @Field()
  public password: string
}
