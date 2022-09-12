import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import jwt from 'jsonwebtoken'
import Env from '@ioc:Adonis/Core/Env'
import CustomException from 'App/Exceptions/CustomException'
import { IUser } from 'App/Interfaces/schemaInterfaces'
import errorHandler from 'App/utils/errorHandler'
import User from 'App/Models/UserModel'

export default class Protect {

  private jwtVerifyPromise(token: string, secret: string) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, function (err, decoded) {
        if (err) {
          return reject(err)
        }
        return resolve(decoded)
      })
    })
  }

  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    try {
      const token = ctx.request.headers().authorization?.split('Bearer ')[1]
      if (token) {
        const data = await this.jwtVerifyPromise(token, Env.get('JWT_SECRET')) as IUser
        const user = await User.findOne({ _id: data.id, active: true })
        if (!user) throw new CustomException("User does not exist", ctx, 404, 1)
        ctx.user = { id: data.id, email: data.email }
        return await next()
      }
      throw new CustomException("Signin required", ctx, 401, 1)
    } catch (error) {
      errorHandler(error, ctx)
    }
  }
}
