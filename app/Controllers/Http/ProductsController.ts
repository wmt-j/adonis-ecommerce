import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CustomException from 'App/Exceptions/CustomException'
import Category from 'App/Models/CategoryModel'
import Product from 'App/Models/ProductsModel'

export default class ProductsController {
    public async index({ }: HttpContextContract) {
        const products = await Product.find()
        return products
    }

    public async store(ctx: HttpContextContract) {
        try {
            const { name, price, description, discount, category, seller } = ctx.request.body()
            const productCategory = await Category.findOne({ name: category })
            let newProductCategory = productCategory
            if (!productCategory) {
                newProductCategory = await Category.create({ name: category })
            }
            const newProduct = await Product.create({ name, price, description, discount, category: newProductCategory?.id, seller })
            return ctx.response.created(newProduct)
        } catch (error) {
            throw new CustomException(error.message, ctx)
        }
    }

    public async show(ctx: HttpContextContract) {
        try {
            const { id } = ctx.params
            const product = await Product.findById(id)
            return ctx.response.ok(product)
        } catch (error) {
            throw new CustomException(error.message, ctx)
        }
    }

    public async update(ctx: HttpContextContract) {
        try {
            const { id } = ctx.params
            const { name, price, description, discount } = ctx.request.body()
            const updatedProduct = await Product.findByIdAndUpdate(id, { name, price, description, discount }, { new: true, runValidators: true })
            console.log(updatedProduct)
            return ctx.response.created(updatedProduct)
        } catch (error) {
            throw new CustomException(error.message, ctx)
        }
    }

    public async destroy(ctx: HttpContextContract) {
        try {
            const { id } = ctx.params
            await Product.findByIdAndDelete(id)
            return ctx.response.noContent()
        } catch (error) {
            throw new CustomException(error.message, ctx)
        }
    }
}
