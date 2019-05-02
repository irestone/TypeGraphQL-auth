import { mixin } from '../utils/mixin'

import { RegisterMutationResolverMixin } from './userResolver/RegisterMutationResolver.mixin'
import { VerifyMutationResolverMixin } from './userResolver/VerifyMutationResolver.mixin'
import { ForgetPasswordMutationResolverMixin } from './userResolver/ForgetPasswordMutationResolver.mixin'
import { ChangePasswordMutationResolverMixin } from './userResolver/ChangePasswordMutationResolver.mixin'
import { LoginMutationResolverMixin } from './userResolver/LoginMutationResolver.mixin'
import { LogoutMutationResolverMixin } from './userResolver/LogoutMutationResolver.mixin'
import { DeregesterMutationResolverMixin } from './userResolver/DeregisterMutationResolver.mixin'
import { MeQueryResolverMixin } from './userResolver/MeQueryResolver.mixin'
import { UsersQueryResolverMixin } from './userResolver/UsersQueryResolver.mixin'

export const UserResolver = mixin([
  RegisterMutationResolverMixin,
  DeregesterMutationResolverMixin,
  VerifyMutationResolverMixin,
  LoginMutationResolverMixin,
  LogoutMutationResolverMixin,
  ForgetPasswordMutationResolverMixin,
  ChangePasswordMutationResolverMixin,
  MeQueryResolverMixin,
  UsersQueryResolverMixin,
])
