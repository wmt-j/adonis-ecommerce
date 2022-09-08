import mongoose from "mongoose"
import { IOrderDetail } from "App/Interfaces/schemaInterfaces"
import User from "./UserModel"

const orderDetailSchema = new mongoose.Schema<IOrderDetail>({
    quantity: {
        type: Number,
        default: 1,
        min: 0
    },
    product_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Product'
    },
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    order_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Order'
    }
})

orderDetailSchema.pre('save', async function (next) {
    const user = await User.findById(this.user_id)
    this.order_id = user?.order_id
    next()
})

const OrderDetail = mongoose.model('OrderDetail', orderDetailSchema)

export default OrderDetail