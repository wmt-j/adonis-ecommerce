import { ISuppplier } from "App/Interfaces/schemaInterfaces"
import mongoose from "mongoose"
import Product from "./ProductsModel"
import Role from "./RoleModel"
import User from "./UserModel"

const supplierSchema = new mongoose.Schema<ISuppplier>({
    name: {
        type: String,
        trim: true,
        required: true
    },
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    website: String
})

supplierSchema.pre(['deleteOne', 'findOneAndDelete'], async function (next) {
    const toBeDeleted = await this.findOne().clone()
    const customerRole = await Role.findOne({ name: 'customer' })
    await User.findOneAndUpdate({ _id: toBeDeleted?.user_id, supplier_id: { $ne: null }, role: { $ne: customerRole?.id } }, { role: customerRole?.id, supplier_id: null })
    await Product.deleteMany({ seller: toBeDeleted?.id })
    next()
})

const Supplier = mongoose.model('Supplier', supplierSchema)
export default Supplier