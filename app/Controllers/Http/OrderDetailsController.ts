import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import OrderDetail from 'App/Models/OrderDetailModel'
import CustomException from 'App/Exceptions/CustomException'
import Order from 'App/Models/OrderModel'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import errorHandler from '../../utils/errorHandler'
import OrdersController from './OrdersController'
import Product from 'App/Models/ProductsModel'

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
            const product = await Product.findById(product_id)
            if (!product) throw new CustomException("Product does not exist", ctx, 404, 1)
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
            const updatedOrderDetail = await OrderDetail.findByIdAndUpdate(id, { quantity }, { runValidators: true })   //returns old order details, as we need old quantity
            if (updatedOrderDetail?.order_id && updatedOrderDetail?.product_id && updatedOrderDetail?.quantity)
                await OrdersController.updateTotal(updatedOrderDetail.order_id.toString(), quantity - updatedOrderDetail.quantity, updatedOrderDetail.product_id.toString(), ctx)
            updatedOrderDetail!.quantity = quantity
            ctx.response.created(updatedOrderDetail)
        } catch (error) {
            return errorHandler(error, ctx)
        }
    }

    public async destroy(ctx: HttpContextContract) {
        try {
            const { id } = ctx.params
            const deleteOrderDetail = await OrderDetail.findById(id)
            if (deleteOrderDetail?.order_id && deleteOrderDetail?.product_id && deleteOrderDetail?.quantity)
                await OrdersController.updateTotal(deleteOrderDetail?.order_id.toString(), -deleteOrderDetail?.quantity, deleteOrderDetail.product_id.toString(), ctx)
            await deleteOrderDetail?.delete()
            ctx.response.noContent()
        } catch (error) {
            return errorHandler(error, ctx)
        }
    }
}
