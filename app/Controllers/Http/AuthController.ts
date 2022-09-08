import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/UserModel'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import Env from '@ioc:Adonis/Core/Env'
import CustomException from 'App/Exceptions/CustomException'
import { IUser } from 'App/Interfaces/schemaInterfaces'

export default class AuthController {
    private jwtSignPromise(user: IUser) {
        return new Promise((resolve, reject) => {
            jwt.sign({ id: user.id, email: user.email }, Env.get('JWT_SECRET'), function (err: Error, token: string) {
                if (err) { return reject(err) }
                return resolve(token)
            })
        })
    }
    private async signToken(user: IUser, ctx: HttpContextContract) {
        ctx.user = { id: user.id, email: user.email }   //we have to tell typescript about the new object on ctx, done in file contracts/context.ts
        return await this.jwtSignPromise(user)
    }
    public async signup(ctx: HttpContextContract) {
        try {
            const { name, email, password, password_confirm } = ctx.request.body()
            if (password !== password_confirm) throw new Error("Passwords do not match")
            const newUser = await User.create({ name, email, password, password_confirm })
            const token = await this.signToken(newUser, ctx)
            return ctx.response.created({ user: newUser, token })
        } catch (error) {
            throw new CustomException(error.message || error, ctx)
        }
    }

    public async signin(ctx: HttpContextContract) {
        try {
            const { email, password } = ctx.request.body()
            const user = await User.findOne({ email })
            if (!user) throw new Error("Invalid credentials")
            if (!user.password || !await bcrypt.compare(password, user.password)) throw new Error("Invalid credentials")
            const token = await this.signToken(user, ctx)
            return ctx.response.created({ user: user, token })
        } catch (error) {
            throw new CustomException(error.message || error, ctx)
        }
    }
}
