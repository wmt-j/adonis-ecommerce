import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import Review from 'App/Models/ReviewModel'
import errorHandler from '../../utils/errorHandler'
import CustomException from 'App/Exceptions/CustomException'
import Product from 'App/Models/ProductsModel'
import paginate from 'App/utils/paginate'

export default class ReviewsController {
    public async index(ctx: HttpContextContract) {
        try {
            const { page = 1, limit = 10 } = ctx.request.qs()
            const reviews = Review.find()
            ctx.response.ok(await paginate(reviews, page, limit))
        } catch (error) {
            return errorHandler(error, ctx)
        }
    }

    public async store(ctx: HttpContextContract) {
        try {
            const newReviewSchema = schema.create({
                rating: schema.number([rules.range(0, 5)]),
                body: schema.string({ trim: true }, [rules.maxLength(100)]),
                product_id: schema.string({}, [rules.isMongoId()])
            })
            const payload = await ctx.request.validate({
                schema: newReviewSchema,
                messages: {
                    required: '{{field}} is required.',
                    'rating.range': 'Rating must be between {{options.start}} and {{options.end}}.',
                    'body.maxLength': 'Review should not exceed {{options.maxLength}}.'
                }
            })
            const { rating, body, product_id } = payload
            const product = await Product.findById(product_id)
            if (!product) throw new CustomException("Product does not exist", ctx, 404, 1)
            const user_id = ctx.user?.id
            const newReview = await Review.create({ rating, body, product_id, user_id })
            return ctx.response.created(newReview)
        } catch (error) {
            return errorHandler(error, ctx)
        }
    }

    public async show(ctx: HttpContextContract) {
        try {
            const { id } = ctx.params
            const review = await Review.findById(id)
            if (!review) {
                throw new CustomException("Review not found", ctx, 404, 1)
            }
            return ctx.response.ok(review)
        } catch (error) {
            return errorHandler(error, ctx)
        }
    }

    public async update(ctx: HttpContextContract) {
        try {
            const newReviewSchema = schema.create({
                rating: schema.number([rules.range(0, 5)]),
                body: schema.string({ trim: true }, [rules.maxLength(100)]),
            })
            const payload = await ctx.request.validate({
                schema: newReviewSchema,
                messages: {
                    required: '{{field}} is required.',
                    'rating.range': 'Rating must be between {{options.start}} and {{options.end}}.',
                    'body.maxLength': 'Review should not exceed {{options.maxLength}}.'
                }
            })
            const { id } = ctx.params
            const { rating, body } = payload
            const updatedReview = await Review.findByIdAndUpdate(id, { rating, body }, { new: true, runValidators: true })
            return ctx.response.created(updatedReview)
        } catch (error) {
            return errorHandler(error, ctx)
        }
    }

    public async destroy(ctx: HttpContextContract) {
        try {
            const { id } = ctx.params
            await Review.findByIdAndDelete(id)
            return ctx.response.noContent()
        } catch (error) {
            return errorHandler(error, ctx)
        }
    }
}
