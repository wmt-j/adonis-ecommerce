import { ICategory } from "App/Interfaces/schemaInterfaces"
import mongoose from "mongoose"
import slugify from "slugify"

const categorySchema = new mongoose.Schema<ICategory>({
    name: {
        type: String,
        unique: true
    }
})

categorySchema.pre('save', function (next) {
    if (this.name)
        this.name = slugify(this.name)
    next()
})

const Category = mongoose.model('Category', categorySchema)

export default Category