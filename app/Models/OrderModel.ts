import mongoose from "mongoose"
import { IOrder } from "App/Interfaces/schemaInterfaces"
import OrderDetail from "./OrderDetailModel"

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
    },
    toObject: {
        virtuals: true
    }
})

orderSchema.virtual('order_details', {
    ref: 'OrderDetail',
    localField: '_id',
    foreignField: 'order_id'
})

orderSchema.pre('findOneAndDelete', async function (next) { //cascade to order_details
    const order = await this.findOne().populate({ path: 'order_details', select: '_id' }).clone() //clone() to fix, query was already executed error
    for (let i = 0; i < order.order_details.length; i++) {
        await OrderDetail.findByIdAndDelete(order.order_details[i]._id)
    }
    next()
})

const Order = mongoose.model('Order', orderSchema)

export default Order