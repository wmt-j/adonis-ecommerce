import OrderDetail from 'App/Models/OrderDetailModel'
import Order from 'App/Models/OrderModel'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CustomException from 'App/Exceptions/CustomException'
import Product from 'App/Models/ProductsModel'
import { IOrderDetail } from 'App/Interfaces/schemaInterfaces'

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
            const orderList = ctx.request.body() as Array<IOrderDetail>
            let total = 0
            for (let i = 0; i < orderList.length; i++) {
                const product = await Product.findById(orderList[i].product_id)
                const priceEach = product?.price as number * (1 - (product?.discount as number / 100))
                const productQuantity = orderList[i]!.quantity as number
                total += priceEach as number * productQuantity
            }
            const newOrder = await Order.create({ total, user_id: ctx.user?.id })

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

    public async placeOrder(ctx: HttpContextContract) {
        try {
            const { id } = ctx.params
            const placed_order = await Order.findByIdAndUpdate(id, { status: "waiting", ordered_at: Date.now() }, { new: true, runValidators: true }).populate({ path: 'order_details', populate: { path: 'product_id', select: 'name' }, select: 'quantity product_id' })
            ctx.response.ok(placed_order)
        } catch (error) {
            throw new CustomException(error.message || error, ctx)
        }
    }
}
