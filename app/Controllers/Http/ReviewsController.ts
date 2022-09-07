import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Review from 'App/Models/ReviewModel'
import CustomException from 'App/Exceptions/CustomException'

export default class ReviewsController {
    public async index(ctx: HttpContextContract) {
        try {
            const reviews = await Review.find()
            ctx.response.ok(reviews)
        } catch (error) {
            throw new CustomException(error.message || error, ctx)
        }
    }

    public async store(ctx: HttpContextContract) {
        try {
            const { rating, body } = ctx.request.body()
            const newReview = await Review.create({ rating, body })
            return ctx.response.created(newReview)
        } catch (error) {
            throw new CustomException(error.message || error, ctx)
        }
    }

    public async show(ctx: HttpContextContract) {
        try {
            const { id } = ctx.params
            const review = await Review.findById(id)
            return ctx.response.ok(review)
        } catch (error) {
            throw new CustomException(error.message || error, ctx)
        }
    }

    public async update(ctx: HttpContextContract) {
        try {
            const { id } = ctx.params
            const { rating, body } = ctx.request.body()
            const updatedReview = await Review.findByIdAndUpdate(id, { rating, body }, { new: true, runValidators: true })
            return ctx.response.created(updatedReview)
        } catch (error) {
            throw new CustomException(error.message || error, ctx)
        }
    }

    public async destroy(ctx: HttpContextContract) {
        try {
            const { id } = ctx.params
            await Review.findByIdAndDelete(id)
            return ctx.response.noContent()
        } catch (error) {
            throw new CustomException(error.message || error, ctx)
        }
    }
}
