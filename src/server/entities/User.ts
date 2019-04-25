import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'
import { ObjectType, Field, ID } from 'type-graphql'
import { GraphQLScalarType } from 'graphql'

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field((): GraphQLScalarType => ID)
  @PrimaryGeneratedColumn()
  public id: number

  @Field()
  @Column('text') // todo make it unique
  public email: string

  @Field()
  @Column()
  public username: string

  @Column()
  public password: string
}
