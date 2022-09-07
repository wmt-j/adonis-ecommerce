import { Exception } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new MongooseErrorException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/

function handle(message: string, ctx: HttpContextContract, status?: number | undefined, code?: string | undefined) {
    if (message.includes("Cast to ObjectId failed")) {
        return ctx.response.status(status || 404).send({ "error": code || "" + " Id not found!" })
    }
    else if (message.includes("E11000")) {
        return ctx.response.status(status || 400).send({ "error": code || "" + " Duplicate values not allowed" })
    }
    else if (message.includes("Invalid credentials")) {
        return ctx.response.status(status || 400).send({ "error": code || "" + message })
    }
}

export default class MongooseErrorException extends Exception {
    constructor(message: string, ctx: HttpContextContract, status?: number | undefined, code?: string | undefined) {
        super(message, status, code)
        console.log(message)
        handle(message, ctx, status, code)
    }
}
