import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import CustomException from 'App/Exceptions/CustomException'
import OrderDetail from 'App/Models/OrderDetailModel'
import Order from 'App/Models/OrderModel'
import Review from 'App/Models/ReviewModel'
import Role from 'App/Models/RoleModel'
import User from 'App/Models/UserModel'
import errorHandler from 'App/utils/errorHandler'
import paginate from 'App/utils/paginate'

export default class UsersController {
    public async index(ctx: HttpContextContract) {
        try {
            const { page = 1, limit = 10 } = ctx.request.qs()
            const users = User.find().populate('role')
            return ctx.response.ok(await paginate(users, page, limit))
        } catch (error) {
            return errorHandler(error, ctx)
        }
    }

    public async store(ctx: HttpContextContract) {
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
            return ctx.response.created({ user: newUser })
        } catch (error) {
            return errorHandler(error, ctx)
        }
    }

    public async show(ctx: HttpContextContract) {
        try {
            const { id } = ctx.params
            const user = await User.findById(id)
            if (!user) {
                throw new CustomException("No user found", ctx, 404, 1)
            }
            return ctx.response.ok(user)
        } catch (error) {
            return errorHandler(error, ctx)
        }
    }

    public async update(ctx: HttpContextContract) {
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
                password_confirm: schema.string(),
                phone: schema.string.optional({}, [rules.mobile({
                    locale: ['pt-BR', 'en-IN', 'en-US']
                })]),
                address: schema.string.optional()
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
            const { id } = ctx.params
            const { name, email, password, password_confirm, phone, address } = payload
            const updatedUser = await User.findByIdAndUpdate(id, { name, email, password, password_confirm, phone, address }, { new: true, runValidators: true })
            return ctx.response.ok(updatedUser)
        } catch (error) {
            return errorHandler(error, ctx)
        }
    }

    public async destroy(ctx: HttpContextContract) {
        try {
            const { id } = ctx.params
            await User.findByIdAndUpdate(id, { active: false })    //cascade to orders, products, order_details, reviews
            return ctx.response.noContent()
        } catch (error) {
            return errorHandler(error, ctx)
        }
    }

    public async myOrders(ctx: HttpContextContract) {
        try {
            const myOrders = await Order.find({ user_id: ctx.user?.id }).populate({ path: 'order_details', populate: { path: 'product_id', select: 'name price discount' }, select: 'quantity product_id' })
            ctx.response.ok(myOrders)
        } catch (error) {
            return errorHandler(error, ctx)
        }

    }

    public async myReviews(ctx: HttpContextContract) {
        try {
            const myReviews = await Review.find({ user_id: ctx.user?.id })
            ctx.response.ok(myReviews)
        } catch (error) {
            errorHandler(error, ctx)
        }
    }

    public async myOrderDetails(ctx: HttpContextContract) {
        try {
            const myOrderDetails = await OrderDetail.find({ user_id: ctx.user?.id }).populate('product_id')
            ctx.response.ok(myOrderDetails)
        } catch (error) {
            return errorHandler(error, ctx)
        }

    }
}
