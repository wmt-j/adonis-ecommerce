import mongoose from "mongoose"

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ["customer", "seller", "admin"],
        default: "customer"
    }
})

const Role = mongoose.model('Role', roleSchema)

export default Role