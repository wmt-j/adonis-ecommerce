import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import mongoose from 'mongoose'

export default class MongooseConnection {
  public async handle({ }: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    try {
      if (mongoose.connection.readyState) return await next()
      mongoose.connect(Env.get('MONGODB_URI'))
      console.log("Database Connected")
      await next()
    } catch (error) { return { "error": error } }
  }
}
