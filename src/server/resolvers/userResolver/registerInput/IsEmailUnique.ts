import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'

import { User } from '../../../types'

@ValidatorConstraint({ async: true })
class IsEmailUniqueConstraint implements ValidatorConstraintInterface {
  public async validate(email: string): Promise<boolean> {
    const user = await User.findOne({ where: { email } })
    return !user
  }
}

export function IsEmailUnique(
  validationOptions?: ValidationOptions
): (object: Record<string, any>, propertyName: string) => void {
  return (object: Record<string, any>, propertyName: string): void => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailUniqueConstraint,
    })
  }
}
