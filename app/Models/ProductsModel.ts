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
        ref: 'User',
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
    }
})

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