import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Product from 'App/Models/ProductsModel'
import CustomException from 'App/Exceptions/CustomException'
import Review from 'App/Models/ReviewModel'
import User from 'App/Models/UserModel'
import OrderDetail from 'App/Models/OrderDetailModel'
import Role from 'App/Models/RoleModel'
import Order from 'App/Models/OrderModel'
import errorHandler from 'App/utils/errorHandler'
import Supplier from 'App/Models/SupplierModel'

export default class RestrictToOwn {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    try {
      const { id } = ctx.params
      const route = ctx.route?.pattern.split('/')[1]
      const userRole = await Role.findById(ctx.user?.role)
      if (userRole?.name === 'admin') return await next()
      else if (route === 'product') {
        const product = await Product.findById(id)
        if (product?.seller?.toString() === ctx.user?.id) {
          return await next()
        }
      }
      else if (route === 'review') {
        const review = await Review.findById(id)
        if (review?.user_id?.toString() === ctx.user?.id) {
          return await next()
        }
      }
      else if (route === 'user') {
        const user = await User.findById(id)
        if (user?.id?.toString() === ctx.user?.id) {
          return await next()
        }
      }
      else if (route === 'order-detail') {
        const orderDetail = await OrderDetail.findById(id)
        if (orderDetail?.user_id?.toString() === ctx.user?.id) {
          return await next()
        }
      }
      else if (route === 'order') {
        const order = await Order.findById(id)
        if (order?.user_id?.toString() === ctx.user?.id) {
          return await next()
        }
      }
      else if (route === 'supplier') {
        const order = await Supplier.findById(id)
        if (order?.user_id?.toString() === ctx.user?.id) {
          return await next()
        }
      }
      throw new CustomException("Access denied", ctx, 401, 1)
    } catch (error) {
      return errorHandler(error, ctx)
    }
  }
}
