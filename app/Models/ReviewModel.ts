import mongoose from "mongoose"
import { IReview } from "App/Interfaces/schemaInterfaces"
import Product from "./ProductsModel"

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

reviewSchema.pre('save', async function (next) {
    const product = await Product.findById(this.product_id)
    //assuming product exists
    product?.updateRatings((data: any, error: any) => {
        if (error) throw new Error(error)
        next()
    }, this.rating)
})

reviewSchema.pre(['findOneAndDelete', 'findOneAndUpdate'], async function (next) {
    const review = await Review.findOne(this)
    const product = await Product.findById(review?.product_id)
    //assuming product exists
    product?.updateRatings((data: any, error: any) => {
        if (error) throw new Error(error)
        next()
    }, 0, review?.rating)
})

reviewSchema.post('findOneAndUpdate', async function () {
    const review = await Review.findOne(this)
    const product = await Product.findById(review?.product_id)
    //assuming product exists
    product?.updateRatings((data: any, error: any) => {
        if (error) throw new Error(error)
    }, review?.rating)
})

const Review = mongoose.model('Review', reviewSchema)

export default Review