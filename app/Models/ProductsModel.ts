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
    }
})

const Product = mongoose.model('Product', productSchema)

export default Product