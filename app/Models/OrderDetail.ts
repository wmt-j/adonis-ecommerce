import mongoose from "mongoose"

const orderDetailSchema = new mongoose.Schema({
    quantity: {
        type: Number,
        default: 1,
        min: 0
    },
    product_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Product'
    }
})

const OrderDetail = mongoose.model('OrderDetail', orderDetailSchema)

export default OrderDetail