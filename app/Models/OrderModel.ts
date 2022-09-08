import mongoose from "mongoose"
import { IOrder } from "App/Interfaces/schemaInterfaces"

const orderSchema = new mongoose.Schema<IOrder>({
    total: {
        type: Number,
        min: 0,
        default: 0
    },
    status: {
        type: String,
        enum: ["delivered", "pending", "shipped", "waiting"],
        default: "pending"
    },
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
})

const Order = mongoose.model('Order', orderSchema)

export default Order