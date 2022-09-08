import mongoose from "mongoose"
import { IReview } from "App/Interfaces/schemaInterfaces"

const reviewSchema = new mongoose.Schema<IReview>({
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