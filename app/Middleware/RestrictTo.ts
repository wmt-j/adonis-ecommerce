import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CustomException from 'App/Exceptions/CustomException'
import Role from 'App/Models/RoleModel'

export default class RestrictTo {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>, roles?: Array<string>) {
    // code for middleware goes here. ABOVE THE NEXT CALL

    if (!ctx.user || !ctx.user.role) throw new CustomException("Access denied", ctx)
    const userRole = await Role.findById(ctx.user.role)
    if (userRole?.name && roles && roles.includes(userRole.name)) {
      return await next()
    }
    throw new CustomException("Access denied", ctx)
  }
}
