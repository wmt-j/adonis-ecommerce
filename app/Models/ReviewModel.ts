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
        ref: 'Product',
        required: true
    },
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

const Review = mongoose.model('Review', reviewSchema)

export default Review