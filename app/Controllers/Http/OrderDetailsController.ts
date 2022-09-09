import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import OrderDetail from 'App/Models/OrderDetailModel'
import CustomException from 'App/Exceptions/CustomException'
import Order from 'App/Models/OrderModel'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import errorHandler from '../../utils/errorHandler'
import OrdersController from './OrdersController'

export default class OrderDetailsController {
    public async index(ctx: HttpContextContract) {
        try {
            const orderDetails = await OrderDetail.find()
            ctx.response.ok(orderDetails)
        } catch (error) {
            return errorHandler(error, ctx)
        }
    }

    public async store(ctx: HttpContextContract) {
        try {
            const newOrderDetailSchema = schema.create({
                quantity: schema.number([rules.range(0, 50)]),
                product_id: schema.string({}, [rules.minLength(12), rules.isMongoId()])
            })
            const payload = await ctx.request.validate({
                schema: newOrderDetailSchema,
                messages: {
                    number: 'Quantity should be a number',
                    'quantity.range': 'Quantity should be between {{ options.start }} and {{ options.stop }}'
                }
            })
            const { quantity, product_id } = payload
            let pendingOrder = await Order.findOne({ status: "pending" })
            if (!pendingOrder) {
                pendingOrder = await Order.create({ user_id: ctx.user?.id })
            }
            await OrdersController.updateTotal(pendingOrder?.id, quantity, product_id, ctx)
            const newOrderDetail = await OrderDetail.create({ quantity, product_id, user_id: ctx.user?.id, order_id: pendingOrder?.id })
            ctx.response.created(newOrderDetail)
        } catch (error) {
            return errorHandler(error, ctx)
        }
    }

    public async show(ctx: HttpContextContract) {
        try {
            const { id } = ctx.params
            const orderDetail = await OrderDetail.findById(id)
            if (!orderDetail) throw new CustomException("No order detail found.", ctx, 404, 1)
            ctx.response.ok(orderDetail)
        } catch (error) {
            return errorHandler(error, ctx)
        }
    }

    public async update(ctx: HttpContextContract) {
        try {
            const newOrderDetailSchema = schema.create({
                quantity: schema.number([rules.range(0, 50)]),
            })
            const payload = await ctx.request.validate({
                schema: newOrderDetailSchema,
                messages: {
                    number: 'Quantity should be a number',
                    'quantity.range': 'Quantity should be between {{ options.start }} and {{ options.stop }}'
                }
            })
            const { id } = ctx.params
            const { quantity } = payload
            if (quantity < 1) return this.destroy(ctx)
            const updatedOrderDetail = await OrderDetail.findByIdAndUpdate(id, { quantity }, { new: true, runValidators: true })
            ctx.response.created(updatedOrderDetail)
        } catch (error) {
            return errorHandler(error, ctx)
        }
    }

    public async destroy(ctx: HttpContextContract) {
        try {
            const { id } = ctx.params
            await OrderDetail.findByIdAndDelete(id)
            ctx.response.noContent()
        } catch (error) {
            return errorHandler(error, ctx)
        }
    }
}
