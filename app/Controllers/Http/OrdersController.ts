import OrderDetail from 'App/Models/OrderDetailModel'
import Order from 'App/Models/OrderModel'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CustomException from 'App/Exceptions/CustomException'
import Product from 'App/Models/ProductsModel'
import { IOrderDetail } from 'App/Interfaces/schemaInterfaces'
import errorHandler from 'App/utils/errorHandler'

export default class OrdersController {
    public async index(ctx: HttpContextContract) {
        try {
            const { page = 1, limit = 10 } = ctx.request.qs()
            const orders = await Order.find().sort({ ordered_at: -1 }).skip((page - 1) * limit).limit(limit).populate({ path: 'order_details', populate: { path: 'product_id', select: 'name price  discount' }, select: 'quantity product_id' })
            ctx.response.ok(orders)
        } catch (error) {
            return errorHandler(error, ctx)
        }
    }

    public async store(ctx: HttpContextContract) {
        try {
            const orderList = ctx.request.body() as Array<IOrderDetail>
            let total = 0
            for (let i = 0; i < orderList.length; i++) {
                const product = await Product.findById(orderList[i].product_id)
                if (!product) {
                    throw new CustomException("Given product not found!", ctx, 404, 1)
                }
                const priceEach = product.price as number * (1 - (product.discount as number / 100))
                const productQuantity = orderList[i]!.quantity as number
                total += priceEach as number * productQuantity
            }
            const newOrder = await Order.create({ total, user_id: ctx.user?.id })

            for (let i = 0; i < orderList.length; i++) {
                await OrderDetail.create({ ...orderList[i], user_id: ctx.user?.id, order_id: newOrder.id })
            }
            ctx.response.created(newOrder)
        } catch (error) {
            return errorHandler(error, ctx)
        }
    }

    public async show(ctx: HttpContextContract) {
        try {
            const { id } = ctx.params
            const order = await Order.findById(id).populate({ path: 'order_details', populate: { path: 'product_id', select: 'name' } })
            if (!order) {
                throw new CustomException("No order found", ctx, 404, 1)
            }
            ctx.response.created(order)
        } catch (error) {
            return errorHandler(error, ctx)
        }
    }

    public async update(ctx: HttpContextContract) {
        try {
            const { id } = ctx.params
            const { status } = ctx.request.body()
            const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true, runValidators: true })
            ctx.response.created(updatedOrder)
        } catch (error) {
            return errorHandler(error, ctx)
        }
    }

    public async destroy(ctx: HttpContextContract) {
        try {
            const { id } = ctx.params
            await Order.findOneAndDelete({ _id: id, status: { $ne: 'delivered' } })
            ctx.response.noContent()
        } catch (error) {
            return errorHandler(error, ctx)
        }
    }

    public async placeOrder(ctx: HttpContextContract) {
        try {
            const { id } = ctx.params
            const placedOrder = await Order.findOneAndUpdate({ _id: id, status: "pending" }, { status: "waiting", ordered_at: Date.now() }, { new: true }).populate({ path: 'order_details', populate: { path: 'product_id', select: 'name' }, select: 'quantity product_id' })
            if (!placedOrder) {
                throw new Error("No pending orders.")
            }
            ctx.response.ok(placedOrder)
        } catch (error) {
            return errorHandler(error, ctx)
        }
    }

    public static async updateTotal(order_id: string, quantity: number, product_id: string, ctx: HttpContextContract) {
        const order = await Order.findById(order_id)
        const product = await Product.findById(product_id)
        if (!order || !product) throw new CustomException("Failed to add Product", ctx, 404, 1)
        if (!order.total || !product.price) return
        order.total += (product.price * (1 - (product.discount as number / 100))) * quantity
        await order.save({ validateBeforeSave: false })
    }   //price always increases, if quan. changed from 1 to 5 price increases by 5 instead of 4
}
