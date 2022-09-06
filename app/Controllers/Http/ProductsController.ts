import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Product from 'App/Models/ProductsModel'

export default class ProductsController {
    public async index({ }: HttpContextContract) {
        const products = await Product.find()
        return products
    }

    public async store({ request, response }: HttpContextContract) {
        const { name, price, description, discount } = request.body()
        const newProduct = await Product.create({ name, price, description, discount })
        return response.created(newProduct)
    }

    public async show({ response, params }: HttpContextContract) {
        const { id } = params
        const product = await Product.findById(id)
        return response.ok(product)
    }

    public async update({ params, request, response }: HttpContextContract) {
        const { id } = params
        const { name, price, description, discount } = request.body()
        const updatedProduct = await Product.findByIdAndUpdate(id, { name, price, description, discount }, { new: true, runValidators: true })
        return response.created(updatedProduct)
    }

    public async destroy({ params, response }: HttpContextContract) {
        const { id } = params
        await Product.findByIdAndDelete(id)
        return response.noContent()
    }
}
