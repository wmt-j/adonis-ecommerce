import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
    total: {
        type: Number,
        min: 0
    },
    status: {
        type: String,
        enum: ["delivered", "pending", "shipped", "waiting"]
    },
    order_detail_id: {
        type: mongoose.Types.ObjectId,
        ref: 'OrderDetail'
    },
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
})

const Order = mongoose.model('Order', orderSchema)

export default Order