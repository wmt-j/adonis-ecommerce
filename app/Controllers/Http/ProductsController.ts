import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import Category from 'App/Models/CategoryModel'
import Product from 'App/Models/ProductsModel'
import slugify from 'slugify'
import errorHandler from '../../utils/errorHandler'
import CustomException from 'App/Exceptions/CustomException'

export default class ProductsController {
    public async index(ctx: HttpContextContract) {
        try {
            const products = await Product.find().populate('category')
            ctx.response.ok(products)
        } catch (error) {
            return errorHandler(error, ctx)
        }
    }

    public async store(ctx: HttpContextContract) {
        try {
            const newProductSchema = schema.create({
                name: schema.string({ trim: true }, [rules.maxLength(50)]),
                price: schema.number([rules.range(0, Number.MAX_VALUE)]),
                description: schema.string({ trim: true }, [rules.maxLength(500)]),
                discount: schema.number([rules.range(0, 100)]),
                category: schema.string()
            })
            const payload = await ctx.request.validate({
                schema: newProductSchema,
                messages: {
                    required: '{{field}} is required.',
                    'name.maxLength': 'Name cannot exceed 50 characters.',
                    'description.maxLength': 'Name cannot exceed 500 characters.',
                    'discount': 'Discount should be in the range of {{options.start}} to {{options.end}}.',
                    'discount.range': 'Discount should be between 0 and 100.',
                    'price.range': 'Price should not be less than 0.'
                }
            })
            const { name, price, description, discount, category } = payload
            const productCategory = await Category.findOne({ name: slugify(category) })
            let newProductCategory = productCategory
            if (!productCategory) {
                newProductCategory = await Category.create({ name: category })
            }
            const seller = ctx.user?.id
            const newProduct = await Product.create({ name, price, description, discount, category: newProductCategory?.id, seller })
            return ctx.response.created(newProduct)
        } catch (error) {
            return errorHandler(error, ctx)
        }
    }

    public async show(ctx: HttpContextContract) {
        try {
            const { id } = ctx.params
            const product = await Product.findById(id).populate('category').populate('seller')
            if (!product) {
                throw new CustomException("No product found", ctx, 404, 1)
            }
            return ctx.response.ok(product)
        } catch (error) {
            return errorHandler(error, ctx)
        }
    }

    public async update(ctx: HttpContextContract) {
        try {
            const { id } = ctx.params
            const newProductSchema = schema.create({
                name: schema.string({ trim: true }, [rules.maxLength(50)]),
                price: schema.number([rules.range(0, Number.MAX_VALUE)]),
                description: schema.string({ trim: true }, [rules.maxLength(500)]),
                discount: schema.number([rules.range(0, 100)])
            })
            const payload = await ctx.request.validate({
                schema: newProductSchema,
                messages: {
                    required: '{{field}} is required.',
                    'name.maxLength': 'Name cannot exceed 50 characters.',
                    'description.maxLength': 'Name cannot exceed 500 characters.',
                    'discount': 'Discount should be in the range of {{options.start}} to {{options.end}}.',
                    'discount.range': 'Discount should be between 0 and 100.',
                    'price.range': 'Price should not be less than 0.'
                }
            })
            const { name, price, description, discount } = payload
            const updatedProduct = await Product.findByIdAndUpdate(id, { name, price, description, discount }, { new: true, runValidators: true })
            return ctx.response.created(updatedProduct)
        } catch (error) {
            return errorHandler(error, ctx)
        }
    }

    public async destroy(ctx: HttpContextContract) {
        try {
            const { id } = ctx.params
            await Product.findByIdAndDelete(id)
            return ctx.response.noContent()
        } catch (error) {
            return errorHandler(error, ctx)
        }
    }
}
