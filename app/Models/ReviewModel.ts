import mongoose from "mongoose"

const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        min: 0,
        max: 5
    },
    body: {
        type: String,
        maxLength: 100
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