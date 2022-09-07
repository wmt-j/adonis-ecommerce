import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/UserModel'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import Env from '@ioc:Adonis/Core/Env'
import CustomException from 'App/Exceptions/CustomException'

export default class AuthController {
    public async signup(ctx: HttpContextContract) {
        try {
            const { name, email, password, password_confirm } = ctx.request.body()
            const newUser = await User.create({ name, email, password, password_confirm })
            const token = jwt.sign({ id: newUser.id, email: newUser.email }, Env.get('JWT_SECRET'))
            return ctx.response.created({ user: newUser, token })
        } catch (error) {
            throw new CustomException(error.message, ctx)
        }
    }

    public async signin(ctx: HttpContextContract) {
        try {
            const { email, password } = ctx.request.body()
            const user = await User.findOne({ email })
            if (!user) throw new CustomException("Invalid credentials", ctx)
            if (!user.password || !await bcrypt.compare(password, user.password)) throw new CustomException("Invalid credentials", ctx)
            const token = jwt.sign({ id: user?.id, email: user?.email }, Env.get('JWT_SECRET'))
            return ctx.response.created({ user: user, token })
        } catch (error) {
            throw new CustomException(error.message, ctx)
        }
    }
}
