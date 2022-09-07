import mongoose from "mongoose"

const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number
    },
    body: {
        type: String
    },
    product_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Product'
    },
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
})

const Review = mongoose.model('Review', reviewSchema)

export default Review