import mongoose from "mongoose"
import Category from "./CategoryModel"

const productSchema = new mongoose.Schema({
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
        // required: true
    },
    category: Category
})

const Product = mongoose.model('Product', productSchema)

export default Product