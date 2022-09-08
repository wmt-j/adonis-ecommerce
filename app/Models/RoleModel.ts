import mongoose from "mongoose"
import { IRole } from "App/Interfaces/schemaInterfaces"

const roleSchema = new mongoose.Schema<IRole>({
    name: {
        type: String,
        enum: ["customer", "seller", "admin"],
        default: "customer"
    }
})

const Role = mongoose.model('Role', roleSchema)

export default Role