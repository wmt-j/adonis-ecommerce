import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import OrderDetail from 'App/Models/OrderDetailModel'
import CustomException from 'App/Exceptions/CustomException'

export default class OrderDetailsController {
    public async index(ctx: HttpContextContract) {
        try {
            const orderDetails = await OrderDetail.find()
            ctx.response.ok(orderDetails)
        } catch (error) {
            throw new CustomException(error.message || error, ctx)
        }
    }

    public async store(ctx: HttpContextContract) {
        try {
            const { quantity, product_id } = ctx.request.body()

            const newOrderDetail = await OrderDetail.create({ quantity, product_id, user_id: ctx.user?.id })
            ctx.response.created(newOrderDetail)
        } catch (error) {
            throw new CustomException(error.message || error, ctx)
        }
    }

    public async show(ctx: HttpContextContract) {
        try {
            const { id } = ctx.params
            const orderDetail = await OrderDetail.findById(id)
            ctx.response.ok(orderDetail)
        } catch (error) {
            throw new CustomException(error.message || error, ctx)

        }
    }

    public async update(ctx: HttpContextContract) {
        try {
            const { id } = ctx.params
            const { quantity } = ctx.request.body()
            if (quantity < 1) return this.destroy(ctx)
            const updatedOrderDetail = await OrderDetail.findByIdAndUpdate(id, { quantity }, { new: true, runValidators: true })
            ctx.response.created(updatedOrderDetail)
        } catch (error) {
            throw new CustomException(error.message || error, ctx)
        }
    }

    public async destroy(ctx: HttpContextContract) {
        try {
            const { id } = ctx.params
            await OrderDetail.findByIdAndDelete(id)
            ctx.response.noContent()
        } catch (error) {
            throw new CustomException(error.message || error, ctx)
        }
    }
}
