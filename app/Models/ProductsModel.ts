import { IProduct } from "App/Interfaces/schemaInterfaces"
import mongoose from "mongoose"

const productSchema = new mongoose.Schema<IProduct>({
    name: {
        type: String,
        trim: true,
        required: true
    },
    price: {
        type: Number,
        min: 0
    },
    discount: {
        type: Number,
        min: 0,
        max: 100
    },
    description: {
        type: String,
        maxLength: 300
    },
    seller: {
        type: mongoose.Types.ObjectId,
        ref: 'Supplier',
        required: true
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    total: {
        type: Number,
        default: function () {
            return (this.price || 0) * (1 - (this.discount || 0) / 100)
        }
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    avgRating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    noOfRatings: {
        type: Number,
        default: 0
    }
}, {
    toJSON: {
        virtuals: true
    }
})

productSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product_id'
})

productSchema.methods.updateRatings = async function (cb: Function, ratingAdded: number, ratingRemoved?: number) {
    try {
        if (ratingAdded > 0)    //Review created / pre update
            this.avgRating = (this.avgRating * this.noOfRatings + ratingAdded) / (++this.noOfRatings)
        if (ratingRemoved) {    //Review deleted / post update
            if (this.noOfRatings > 1)
                this.avgRating = (this.noOfRatings * this.avgRating - ratingRemoved) / (--this.noOfRatings)
            else {
                this.noOfRatings = 0
                this.avgRating = 0
            }
        }
        await this.save()
        cb(this)
    } catch (error) {
        cb(null, error)
    }
}

// productSchema.virtual('total').get(function (): number {    //cannot sort by virtual fields
//     return (this.price || 0) * (1 - (this.discount || 0) / 100)
// })

productSchema.pre('findOneAndUpdate', async function (next) {
    const product = await this.findOne().clone()
    product.total = (product.price || 0) * (1 - (product.discount || 0) / 100)
    await product.save()
    next()
})

const Product = mongoose.model('Product', productSchema)

export default Product