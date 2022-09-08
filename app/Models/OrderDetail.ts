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
    }
})

const OrderDetail = mongoose.model('OrderDetail', orderDetailSchema)

export default OrderDetail