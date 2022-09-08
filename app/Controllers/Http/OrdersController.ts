import OrderDetail from 'App/Models/OrderDetailModel'
import Order from 'App/Models/OrderModel'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CustomException from 'App/Exceptions/CustomException'

export default class OrdersController {
    public async index(ctx: HttpContextContract) {
        try {
            const orders = await Order.find().populate({ path: 'order_details', populate: { path: 'product_id', select: 'name' }, select: 'quantity product_id' })
            ctx.response.ok(orders)
        } catch (error) {
            throw new CustomException(error.message || error, ctx)
        }
    }

    public async store(ctx: HttpContextContract) {
        try {
            const orderList = ctx.request.body() as Array<Object>
            const newOrder = await Order.create({ user_id: ctx.user?.id })

            for (let i = 0; i < orderList.length; i++) {
                await OrderDetail.create({ ...orderList[i], user_id: ctx.user?.id, order_id: newOrder.id })
            }
            ctx.response.created(newOrder)
        } catch (error) {
            throw new CustomException(error.message || error, ctx)
        }
    }

    public async show(ctx: HttpContextContract) {
        try {
            const { id } = ctx.params
            const order = await Order.findById(id).populate({ path: 'order_details', populate: { path: 'product_id', select: 'name' } })
            ctx.response.created(order)
        } catch (error) {
            throw new CustomException(error.message || error, ctx)
        }
    }

    public async update(ctx: HttpContextContract) {
        try {
            const { id } = ctx.params
            const { total, status } = ctx.request.body()
            const updatedOrder = await Order.findByIdAndUpdate(id, { total, status }, { new: true, runValidators: true })
            ctx.response.created(updatedOrder)
        } catch (error) {
            throw new CustomException(error.message || error, ctx)
        }
    }

    public async destroy(ctx: HttpContextContract) {
        try {
            const { id } = ctx.params
            await Order.findByIdAndDelete(id)
            ctx.response.noContent()
        } catch (error) {
            throw new CustomException(error.message || error, ctx)
        }
    }
}
