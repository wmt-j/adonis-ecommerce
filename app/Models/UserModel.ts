import mongoose from "mongoose"
import Role from "./RoleModel"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    password_confirm: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    // role: {
    //     type: Role
    // },
    order_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Order'
    },
    phone: Number,
    address: {
        type: String,
        required: true
    }
})

const User = mongoose.model('User', userSchema)

export default User