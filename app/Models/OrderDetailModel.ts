import mongoose from "mongoose"
import { IOrderDetail } from "App/Interfaces/schemaInterfaces"

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

const OrderDetail = mongoose.model('OrderDetail', orderDetailSchema)

export default OrderDetail