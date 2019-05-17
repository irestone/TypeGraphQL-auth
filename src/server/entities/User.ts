import { Entity, Column, BaseEntity, ObjectID, ObjectIdColumn } from 'typeorm'
import { ObjectType, Field, ID } from 'type-graphql'
import { GraphQLScalarType } from 'graphql'

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field((): GraphQLScalarType => ID)
  @ObjectIdColumn()
  public id: ObjectID

  @Field()
  @Column('text') // todo make it unique
  public email: string

  @Field()
  @Column()
  public username: string

  @Column()
  public password: string

  @Column('bool', { default: false })
  public verified: boolean
}
