/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/
import Env from '@ioc:Adonis/Core/Env'
import mongoose from 'mongoose'
import 'App/Models/RoleModel'
import 'App/Models/UserModel'
import 'App/Models/OrderDetailModel'
import 'App/Models/OrderModel'
import 'App/Models/ReviewModel'
import 'App/Models/CategoryModel'
import 'App/Models/ProductsModel' //to load schema before route is executed
//The error occurs because the models/ProductsModel.ts has not been interpreted by the time router/index.js has been loaded. 

export default class MongooseConnection {
    public static handle() {
        try {
            if (mongoose.connection.readyState) return
            mongoose.connect(Env.get('MONGODB_URI'))
            console.log("Database Connected")
        } catch (error) { throw new Error(error) }
    }
}

MongooseConnection.handle()