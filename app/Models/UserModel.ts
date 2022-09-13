import { IUser } from "App/Interfaces/schemaInterfaces"
import mongoose from "mongoose"
import bcrypt from 'bcrypt'
import Review from "./ReviewModel"
import Order from "./OrderModel"
import Supplier from "./SupplierModel"

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
    },
    password_confirm: {
        type: String,
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
    },
    supplier_id: {
        type: mongoose.Types.ObjectId,
        ref: "Supplier"
    }
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    if (this.password)
        this.password = await bcrypt.hash(this.password, 12)
    this.password_confirm = ""

    next()
})

userSchema.post('findOneAndUpdate', async function () {
    try {
        const updatedUser = await this.findOne().clone()
        if (!updatedUser) return
        updatedUser.seller_id = null
        if (updatedUser && updatedUser.active === false) {
            // updatedUser.save({ validateBeforeSave: false })
            // await Review.deleteMany({ user_id: updatedUser.id })
            // await Order.deleteMany({ user_id: updatedUser.id })
            // Supplier.deleteOne({ user_id: updatedUser.id })

            await Promise.all([     //faster
                updatedUser.save({ validateBeforeSave: false }),
                Review.deleteMany({ user_id: updatedUser.id }),
                Order.deleteMany({ user_id: updatedUser.id }),
                Supplier.deleteOne({ user_id: updatedUser.id })
            ])
        }

    } catch (error) { throw new Error(error) }
})

const User = mongoose.model('User', userSchema)

export default User