import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CustomException from 'App/Exceptions/CustomException'

export default function (error: any, ctx: HttpContextContract) {
    if (error instanceof (CustomException)) return
    if (error.messages && error.messages.errors) {
        throw new CustomException(error.messages.errors[0].message, ctx, 400, 2)
    }
    throw new CustomException(error.message || error, ctx, 500, 3)
}