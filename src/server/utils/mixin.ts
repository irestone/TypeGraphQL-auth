import { ClassType } from 'type-graphql'

type Mixin = (BaseClass?: ClassType) => ClassType

export const mixin = (mixins: Mixin[]): ClassType => {
  return mixins.reduce((base, mix): ClassType => mix(base), class {})
}
