import { IUser } from "App/Interfaces/schemaInterfaces"
import mongoose from "mongoose"
import bcrypt from 'bcrypt'

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
    order_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Order'
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

const User = mongoose.model('User', userSchema)

export default User