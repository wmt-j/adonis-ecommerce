import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/UserModel'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import Env from '@ioc:Adonis/Core/Env'
import CustomException from 'App/Exceptions/CustomException'
import { IUser } from 'App/Interfaces/schemaInterfaces'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Role from 'App/Models/RoleModel'

export default class AuthController {
    private jwtSignPromise(user: IUser) {
        return new Promise((resolve, reject) => {
            jwt.sign({ id: user.id, email: user.email, role: user.role }, Env.get('JWT_SECRET'), function (err: Error, token: string) {
                if (err) { return reject(err) }
                return resolve(token)
            })
        })
    }
    private async signToken(user: IUser, ctx: HttpContextContract) {
        ctx.user = { id: user.id, email: user.email, role: user.role }   //we have to tell typescript about the new object on ctx, done in file contracts/context.ts
        return await this.jwtSignPromise(user)
    }
    public async signup(ctx: HttpContextContract) {
        try {
            const newUserSchema = schema.create({
                name: schema.string(),
                email: schema.string({ trim: true }, [
                    rules.email()
                ]),
                password: schema.string({}, [
                    rules.minLength(4),  //8 for production
                    rules.confirmed('password_confirm')
                ]),
                password_confirm: schema.string()
            })
            const payload = await ctx.request.validate({
                schema: newUserSchema,
                messages: {
                    required: 'This {{ field }} is required.',
                    'password_confirm.confirmed': 'Passwords do not match.',
                    'email.email': 'Invalid Email'
                }
            })
            const userRole = await Role.findOne({ name: 'customer' })
            const { name, email, password, password_confirm } = payload
            const newUser = await User.create({ name, email, password, password_confirm, role: userRole?.id })
            const token = await this.signToken(newUser, ctx)
            return ctx.response.created({ user: newUser, token })
        } catch (error) {
            if (error.messages && error.messages.errors) {
                error.message = error.messages.errors[0].message
            }
            throw new CustomException(error.message || error, ctx)
        }
    }

    public async signin(ctx: HttpContextContract) {
        try {
            const newUserSchema = schema.create({
                email: schema.string({ trim: true }, [
                    rules.email()
                ]),
                password: schema.string({}, [
                    rules.minLength(4)  //8 for production
                ])
            })
            const payload = await ctx.request.validate({
                schema: newUserSchema,
                messages: {
                    required: '{{ field }} is required.',
                    'email.email': 'Invalid Email'
                }
            })
            const { email, password } = payload
            const user = await User.findOne({ email })
            if (!user) throw new Error("Invalid credentials")
            if (!user.password || !await bcrypt.compare(password, user.password)) throw new Error("Invalid credentials")
            const token = await this.signToken(user, ctx)
            return ctx.response.created({ user: user, token })
        } catch (error) {
            if (error.messages && error.messages.errors) {
                error.message = error.messages.errors[0].message
            }
            throw new CustomException(error.message || error, ctx)
        }
    }
}
