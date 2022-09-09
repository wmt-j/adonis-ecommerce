import { IUser } from "App/Interfaces/schemaInterfaces"
import mongoose from "mongoose"
import bcrypt from 'bcrypt'
import Review from "./ReviewModel"
import Order from "./OrderModel"
import Product from "./ProductsModel"

const userSchema = new mongoose.Schema<IUser>({
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
    role: {
        type: mongoose.Types.ObjectId,
        ref: "Role"
    },
    phone: Number,
    address: {
        type: String,
        trim: true
    }
})

userSchema.pre('save', async function (next) {
    if (this.password)
        this.password = await bcrypt.hash(this.password, 12)
    this.password_confirm = ""

    next()
})

userSchema.post('findOneAndUpdate', async function () {
    try {
        const updatedUser = await this.findOne().clone()
        if (updatedUser.active === false) {
            // await Review.deleteMany({ user_id: updatedUser.id })
            // await Order.deleteMany({ user_id: updatedUser.id })
            // await Product.deleteMany({ seller: updatedUser.id })

            await Promise.all([     //faster
                Review.deleteMany({ user_id: updatedUser.id }),
                Order.deleteMany({ user_id: updatedUser.id }),
                Product.deleteMany({ seller: updatedUser.id })
            ])
        }

    } catch (error) { throw new Error(error) }
})

const User = mongoose.model('User', userSchema)

export default User