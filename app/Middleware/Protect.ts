import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import jwt from 'jsonwebtoken'
import Env from '@ioc:Adonis/Core/Env'
import CustomException from 'App/Exceptions/CustomException'
import { IUser } from 'App/Interfaces/schemaInterfaces'

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
        ctx.user = { id: data.id, email: data.email }
        return await next()
      }
      throw new Error("Signin required")
    } catch (error) {
      throw new CustomException(error.message || error, ctx)
    }
  }
}
