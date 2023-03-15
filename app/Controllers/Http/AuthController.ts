import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/UserModel'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import Env from '@ioc:Adonis/Core/Env'
import CustomException from 'App/Exceptions/CustomException'
import { IUser } from 'App/Interfaces/schemaInterfaces'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Role from 'App/Models/RoleModel'
import errorHandler from '../../utils/errorHandler'

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
                    required: '{{ field }} is required.',
                    'password_confirm.confirmed': 'Passwords do not match.',
                    'email.email': 'Invalid Email',
                    'password.minLength': 'Password should be at least {{options.minLength}} character long.'
                }
            })
            const userRole = await Role.findOne({ name: 'customer' })
            const { name, email, password, password_confirm } = payload
            const newUser = await User.create({ name, email, password, password_confirm, role: userRole?.id })
            const token = await this.signToken(newUser, ctx)
            return ctx.response.created({ user: newUser, token })
        } catch (error) {
            return errorHandler(error, ctx)
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
            const user = await User.findOne({ email, active: true })
            if (!user) throw new CustomException("Invalid credentials", ctx, 401, 1)
            if (!user.password || !await bcrypt.compare(password, user.password)) throw new CustomException("Invalid credentials", ctx, 401, 1)
            const token = await this.signToken(user, ctx)
            return ctx.response.created({ user: user, token })
        } catch (error) {
            return errorHandler(error, ctx)
        }
    }

    public async destroy(ctx: HttpContextContract) {
        try {
            const id = ctx.user?.id
            await User.findByIdAndUpdate(id, { active: false })
            return ctx.response.noContent()
        } catch (error) {
            return errorHandler(error, ctx)
        }
    }

    public async signinGoogle(ctx: HttpContextContract) {
        try {
            const { token } = ctx.request.body()
            const user = await ctx.ally.use('google').userFromToken(token)  //contacts google api, requires internet
            const findUser = await User.findOne({ email: user.email })
            if (!findUser?.active) throw new CustomException("User does not exist", ctx, 404, 1)
            if (!findUser) {
                const userRole = await Role.findOne({ name: 'customer' })
                const newUser = await User.create({ name: user.name, email: user.email, role: userRole, googleToken: token })
                const jwtToken = await this.signToken(newUser, ctx)
                return ctx.response.created({ user: newUser, token: jwtToken })
            }
            else {
                const token = await this.signToken(findUser, ctx)
                return ctx.response.created({ user: findUser, token })
            }
        } catch (error) {
            return errorHandler(error, ctx)
        }
    }

    //requires browser to get access token(frontend routes)

    public async getAccessTokenGoogle(ctx: HttpContextContract) {
        return ctx.ally.use('google').redirect()
    }

    public async callbackGoogle(ctx: HttpContextContract) {
        const google = ctx.ally.use('google')
        if (google.accessDenied()) {
            return 'Access was denied'
        }

        /**
         * Unable to verify the CSRF state
         */
        if (google.stateMisMatch()) {
            return 'Request expired. Retry again'
        }

        /**
         * There was an unknown error during the redirect
         */
        if (google.hasError()) {
            return google.getError()
        }

        /**
         * Finally, access the user
         */
        const user = await google.user()
        return ctx.response.json(user)
    }
}
