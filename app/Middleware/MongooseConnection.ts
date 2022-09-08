import Env from '@ioc:Adonis/Core/Env'
import mongoose from 'mongoose'

export default class MongooseConnection {
  public static handle() {
    // code for middleware goes here. ABOVE THE NEXT CALL
    try {
      if (mongoose.connection.readyState) return
      mongoose.connect(Env.get('MONGODB_URI'))
      console.log("Database Connected")
    } catch (error) { throw new Error(error) }
  }
}
