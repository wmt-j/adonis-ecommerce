import mongoose from "mongoose"

const reviewSchema = new mongoose.Schema({
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

const Review = mongoose.model('Review', reviewSchema)

export default Review