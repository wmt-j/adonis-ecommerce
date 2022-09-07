import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CustomException from 'App/Exceptions/CustomException'
import Role from 'App/Models/RoleModel'
import User from 'App/Models/UserModel'

export default class UsersController {
    public async index(ctx: HttpContextContract) {
        try {
            const users = await User.find().populate('role')
            return ctx.response.ok(users)
        } catch (error) {
            throw new CustomException(error.message, ctx)
        }
    }

    public async store(ctx: HttpContextContract) {
        try {
            const { name, email, password, password_confirm, phone, address, role } = ctx.request.body()
            const userRole = await Role.findOne({ name: role || "customer" })
            const newUser = await User.create({ name, email, password, password_confirm, phone, address, role: userRole?.id })
            return ctx.response.created(newUser)
        } catch (error) {
            throw new CustomException(error.message, ctx)
        }
    }

    public async show(ctx: HttpContextContract) {
        try {
            const { id } = ctx.params
            const user = await User.findById(id)
            return ctx.response.ok(user)
        } catch (error) {
            throw new CustomException(error.message, ctx)
        }
    }

    public async update(ctx: HttpContextContract) {
        try {
            const { id } = ctx.params
            const { name, email, password, password_confirm, phone, address } = ctx.request.body()
            const updatedUser = await User.findByIdAndUpdate(id, { name, email, password, password_confirm, phone, address }, { new: true, runValidators: true })
            return ctx.response.ok(updatedUser)
        } catch (error) {
            throw new CustomException(error.message, ctx)
        }
    }

    public async destroy(ctx: HttpContextContract) {
        try {
            const { id } = ctx.params
            await User.findByIdAndDelete(id)
            return ctx.response.noContent()
        } catch (error) {
            throw new CustomException(error.message, ctx)
        }
    }
}
