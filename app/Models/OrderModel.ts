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
        default: "pending",
        validate: {
            validator: async () => {
                const count = await Order.countDocuments({ status: "pending" })
                if (count > 0)
                    return false
                return true
            },
            message: "There can only be one pending order."
        }
    },
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    ordered_at: {
        type: Date
    }
}, {
    toJSON: {
        virtuals: true
    }
})

orderSchema.virtual('order_details', {
    ref: 'OrderDetail',
    localField: '_id',
    foreignField: 'order_id'
})

const Order = mongoose.model('Order', orderSchema)

export default Order